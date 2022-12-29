# Setting up a Raspberry Pi for Ad Hoc Networking

The Raspberry Pi microcomputer is great for building "Internet of Things" type devices. Perhaps you want to be able to control them remotely via their own wifi network. 

I'm building an updated version of the Enchanted Rose prop which uses wifi, and not Bluetooth, for its control signals. And I don't know what networking environments the prop might be used in. Rather than equip the prop with some kind of way for the prop to join a local WAN, it's far easier for it to broadcast its own tiny network, and be controlled from backstage just on its own. 

The following are instructions which enabled a Raspberry Pi Zero 2W devices to create its own wifi network, broadcast its own ssid, and allow clients (such as mobile browsers) to join it and see a control webpage. 

## Prerequisite: Burn the Raspbian Image of an older version called "Buster" onto your SD card

For the instructions below to work, you *must* use the older "Buster" version of Raspbian. 

The Ad-hoc networking steps described below have **only been tested to work on the "Buster" version**. That's not quite true -- I tried and failed to get them to work on the latest ("Bullet") version of Raspbian OS. The Raspberry Pi Foundation is great, but it's pretty frustrating that they're constantly tweaking the network setup bits -- there are so many links out on the Internet today which refer to old versions and drivers. 

If you are dedicating this Raspberry Pi to its own ad-hoc network, I highly  recommend you use the [Raspbian OS imager](https://www.raspberrypi.com/software/) to create a bootable card with Raspbian OS "Buster" on it. To do that, you need to be sure to download and unzip an image, select it, and also click the GEAR icon to ENABLE SSH with a password, and also set it up with your home wifi's network name (SSID) and password. Be sure to grab and download the "buster" raspbian .img file, and burn that to the SD card. 

ONCE AGAIN: DO NOT JUST CHOOSE THE LATEST RASPBIAN OS; I WAS UNABLE TO GET AD-HOC NETWORKING TO WORK USING IT, BUT I WAS ABLE TO GET IT TO WORK USING "BUSTER." 

After your card is written, you should be able to pop it out and put it in your RPi, and turn on the device. After a few moments, you should be able to ssh into it (Mac) or use PuTTY (Windows) to connect. To find the device's IP address, go into your wifi's router and look for a recently joined Raspberry Pi device. (Generally, the IP address will be the same from session to session.)

For Mac OSX, this looks something like:

```ssh pi@192.168.x.y```

where x and y are numbers. Every Internet device connected to your wifi is assigned a different address; this will vary from device to device. The default password for "pi" is "raspberry". 

Later in these setup instructions, we're going to have it create its own wifi network with its own subnet, and connect on the backend with Ethernet. This is called a "Wide Area Network Access Point" or "Wifi Access Point" configuration, in which the RPi will basically have two IP addresses: one over the wire, and the other wireless. 

## 1. Set up "root" user

Instead of the default user "pi", for some operations you may need root access. For instance, [NeoPixel libraries](https://www.adafruit.com/category/275) need Raspberry Pi "root" permission to run. So it's best to set up a root user password first thing:

```su passwd root```

Then, log out of ssh and log back in with ssh root@<ip address>

From here on, you'll want to sign in as root. 

### Enable remote login for the "root" user

1. ```sudo nano /etc/ssh/sshd_config```
2. Find this line: **PermitRootLogin without-password**
3. Change to: **PermitRootLogin yes**
4. Close and save file.
5. reboot or restart sshd service using: /etc/init

## 2. Get web server running

Install Apache2 Web Server with one line of code:

```bash
sudo apt install apache2 -y
```

This will create a folder in /var/www/html which the Apache web server will run. The install will also ensure that it starts at boot time. 

## 3. Set up Ad Hoc Networking

OK this is the crucial part. HAVE PATIENCE, and follow this closely: 

[documentation/access-point-bridged.adoc at develop · raspberrypi/documentation (github.com)](https://github.com/raspberrypi/documentation/blob/develop/documentation/asciidoc/computers/configuration/access-point-bridged.adoc)

## Setting up a Routed Wireless Access Point

We will want to configure our Raspberry Pi as a Wireless Access Point, so that it broadcasts a wifi ssid, and so mobile devices can connect to it. Ideally, the RPi would also remain connectable to an Ethernet network for development purposes, to install new libraries, etc. 

So a "Routed Wireless Access Point" is perfect for our needs.

**But you need to have patience AND BE SURE YOU ARE WORKING ON RASPBIAN "BULLET", NOT "BULLSEYE" OR LATER.** 

A Raspberry Pi within an Ethernet network can be used as a wireless access point, creating a secondary network. The resulting new wireless network is entirely managed by the Raspberry Pi.

A routed wireless access point can be created using the inbuilt wireless features of the Raspberry Pi 4, Raspberry Pi 3 or Raspberry Pi Zero W, or by using a suitable USB wireless dongle that supports access point mode. It is possible that some USB dongles may need slight changes to their settings. If you are having trouble with a USB wireless dongle, please check the [forums](https://forums.raspberrypi.com/).

This documentation was tested on a Raspberry Pi Zero W2 running a fresh installation of Raspberry Pi OS **Buster**.

### Before you Begin

- Ensure you have root access to your Raspberry Pi. The network setup will be modified as part of the installation: local access, with screen and keyboard connected to your Raspberry Pi, is recommended.
- Connect your Raspberry Pi to the Ethernet network and boot the Raspberry Pi OS.
- Ensure the Raspberry Pi OS on your Raspberry Pi is [up-to-date](https://www.raspberrypi.com/documentation/computers/os.html#updating-and-upgrading-raspberry-pi-os) and reboot if packages were installed in the process.
- Take note of the IP configuration of the Ethernet network the Raspberry Pi is connected to:
  - In this document, we assume IP network `192.164.4.0/24` is configured for the Ethernet LAN, and the Raspberry Pi is going to manage IP network `192.168.11.0/24` for wireless clients.
  - Please select another IP network for wireless, e.g. `192.168.10.0/24`, if IP network `192.168.11.0/24` is already in use by your Ethernet LAN.
- Have a wireless client (laptop, smartphone, …) ready to test your new access point.

### Install AP and Management Software

In order to work as an access point, the Raspberry Pi needs to have the `hostapd` access point software package installed:

```
sudo apt install hostapd
```

Enable the wireless access point service and set it to start when your Raspberry Pi boots:

```
sudo systemctl unmask hostapd
sudo systemctl enable hostapd
```

In order to provide network management services (DNS, DHCP) to wireless clients, the Raspberry Pi needs to have the `dnsmasq` software package installed:

```
sudo apt install dnsmasq
```

Finally, install `netfilter-persistent` and its plugin `iptables-persistent`. This utility helps by saving firewall rules and restoring them when the Raspberry Pi boots:

```
sudo DEBIAN_FRONTEND=noninteractive apt install -y netfilter-persistent iptables-persistent
```

Software installation is complete. We will configure the software packages later on.

### Set up the Network Router

The Raspberry Pi will run and manage a standalone wireless network. It will also route between the wireless and Ethernet networks, providing internet access to wireless clients. If you prefer, you can choose to skip the routing by skipping the section "Enable routing and IP masquerading" below, and run the wireless network in complete isolation.

#### Define the Wireless Interface IP Configuration

The Raspberry Pi runs a DHCP server for the wireless network; this requires static IP configuration for the wireless interface (`wlan0`) in the Raspberry Pi. The Raspberry Pi also acts as the router on the wireless network, and as is customary, we will give it the first IP address in the network: `192.168.11.1`.

To configure the static IP address, edit the configuration file for `dhcpcd` with:

```
sudo nano /etc/dhcpcd.conf
```

Go to the end of the file and add the following:

```
interface wlan0
    static ip_address=192.168.11.1/24
    nohook wpa_supplicant
```

#### Enable Routing and IP Masquerading

This section configures the Raspberry Pi to let wireless clients access computers on the main (Ethernet) network, and from there the internet.

| NOTE | If you wish to block wireless clients from accessing the Ethernet network and the internet, skip this section. |
| ---- | ------------------------------------------------------------ |

To enable routing, i.e. to allow traffic to flow from one network to the other in the Raspberry Pi, create a file using the following command, with the contents below:

```
sudo nano /etc/sysctl.d/routed-ap.conf
```

File contents:

```
# Enable IPv4 routing
net.ipv4.ip_forward=1
```

Enabling routing will allow hosts from network `192.168.11.0/24` to reach the LAN and the main router towards the internet. In order to allow traffic between clients on this foreign wireless network and the internet without changing the configuration of the main router, the Raspberry Pi can substitute the IP address of wireless clients with its own IP address on the LAN using a "masquerade" firewall rule.

- The main router will see all outgoing traffic from wireless clients as coming from the Raspberry Pi, allowing communication with the internet.
- The Raspberry Pi will receive all incoming traffic, substitute the IP addresses back, and forward traffic to the original wireless client.

This process is configured by adding a single firewall rule in the Raspberry Pi:

```
sudo iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
```

Now save the current firewall rules for IPv4 (including the rule above) and IPv6 to be loaded at boot by the `netfilter-persistent` service:

```
sudo netfilter-persistent save
```

Filtering rules are saved to the directory `/etc/iptables/`. If in the future you change the configuration of your firewall, make sure to save the configuration before rebooting.

#### Configure the DHCP and DNS services for the wireless network

The DHCP and DNS services are provided by `dnsmasq`. The default configuration file serves as a template for all possible configuration options, whereas we only need a few. It is easier to start from an empty file.

Rename the default configuration file and edit a new one:

```
sudo mv /etc/dnsmasq.conf /etc/dnsmasq.conf.orig
sudo nano /etc/dnsmasq.conf
```

Add the following to the file and save it:

```
interface=wlan0 # Listening interface
dhcp-range=192.168.11.2,192.168.11.20,255.255.255.0,24h
                # Pool of IP addresses served via DHCP
domain=wlan     # Local wireless DNS domain
address=/gw.wlan/192.168.11.1
                # Alias for this router
```

The Raspberry Pi will deliver IP addresses between `192.168.4.2` and `192.168.4.20`, with a lease time of 24 hours, to wireless DHCP clients. You should be able to reach the Raspberry Pi under the name `gw.wlan` from wireless clients.

| NOTE | There are three IP address blocks set aside for private networks. There is a Class A block from `10.0.0.0` to `10.255.255.255`, a Class B block from `172.16.0.0` to `172.31.255.255`, and probably the most frequently used, a Class C block from `192.168.0.0` to `192.168.255.255`. |
| ---- | ------------------------------------------------------------ |

There are many more options for `dnsmasq`; see the default configuration file (`/etc/dnsmasq.conf`) or the [online documentation](http://www.thekelleys.org.uk/dnsmasq/doc.html) for details.

### Ensure Wireless Operation

*Note, I successfully skipped this subsection*

Countries around the world regulate the use of telecommunication radio frequency bands to ensure interference-free operation. The Linux OS helps users [comply](https://wireless.wiki.kernel.org/en/developers/regulatory/statement) with these rules by allowing applications to be configured with a two-letter "WiFi country code", e.g. `US` for a computer used in the United States.

In the Raspberry Pi OS, 5 GHz wireless networking is disabled until a WiFi country code has been configured by the user, usually as part of the initial installation process (see wireless configuration pages in this [section](https://www.raspberrypi.com/documentation/computers/configuration.html#configuring-networking) for details.)

To ensure WiFi radio is not blocked on your Raspberry Pi, execute the following command:

```
sudo rfkill unblock wlan
```

This setting will be automatically restored at boot time. We will define an appropriate country code in the access point software configuration, next.

### Configure the AP Software

Create the `hostapd` configuration file, located at `/etc/hostapd/hostapd.conf`, to add the various parameters for your new wireless network.

```
sudo nano /etc/hostapd/hostapd.conf
```

Add the information below to the configuration file. This configuration assumes we are using channel 7, with a network name of `EnchantedRose`, and a password `AardvarkBadgerHedgehog`. Note that the name and password should **not** have quotes around them. The passphrase should be between 8 and 64 characters in length.

```
country_code=US
interface=wlan0
ssid=NameOfNetwork
hw_mode=g
channel=7
macaddr_acl=0
auth_algs=1
ignore_broadcast_ssid=0
wpa=2
wpa_passphrase=AardvarkBadgerHedgehog
wpa_key_mgmt=WPA-PSK
wpa_pairwise=TKIP
rsn_pairwise=CCMP
```

Note the line `country_code=US`: it configures the computer to use the correct wireless frequencies in the United States. **Adapt this line** and specify the two-letter ISO code of your country. See [Wikipedia](https://en.wikipedia.org/wiki/ISO_3166-1) for a list of two-letter ISO 3166-1 country codes.

To use the 5 GHz band, you can change the operations mode from `hw_mode=g` to `hw_mode=a`. Possible values for `hw_mode` are:

- a = IEEE 802.11a (5 GHz) (Raspberry Pi 3B+ onwards)
- b = IEEE 802.11b (2.4 GHz)
- g = IEEE 802.11g (2.4 GHz)

**Note that when changing the `hw_mode`, you may need to also change the `channel` - see [Wikipedia](https://en.wikipedia.org/wiki/List_of_WLAN_channels) for a list of allowed combinations.**

### Running the new Wireless AP

Now restart your Raspberry Pi and verify that the wireless access point becomes automatically available.

```
sudo systemctl reboot
```

Once your Raspberry Pi has restarted, search for wireless networks with your wireless client. The network SSID you specified in file `/etc/hostapd/hostapd.conf` should now be present, and it should be accessible with the specified password.

If SSH is enabled on the Raspberry Pi, it should be possible to connect to it from your wireless client as follows, assuming the `pi` account is present: `ssh pi@192.168.11.1`.

If your wireless client has access to your Raspberry Pi (and the internet, if you set up routing), congratulations on setting up your new access point!

If you encounter difficulties, contact the [forums](https://forums.raspberrypi.com/) for assistance. Please refer to this page in your message.

Once this is done, the network should be "EnchantedRose", and the main web address should be 192.168.11.1.



-----

 

## ONGOING: Build/Deployment Notes

### Copying files from Mac to RPi

Use SCP, which has a recursive flag (-rp). For instance, to copy built web files to the apache default directory, change your directory locally to the built webfiles, and then:

```scp -rp . root@192.168.11.1:/var/www/html```

### Copying files from Windows to RPi

The open source FTP program FileZilla supports SCP. 

