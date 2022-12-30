import { FaExchangeAlt, FaLeaf } from "react-icons/fa";
import {
  changeColor,
  dropPetal,
  setStemLight,
  testConnectivity,
} from "../helpers/api";
import { useEffect, useState } from "react";

import Button from "../components/button";
import ColorButton from "../components/color-button";
import Head from "next/head";
import LogWindow from "../components/log-window";
import type { NextPage } from "next";
import ToggleSwitch from "../components/toggle-switch";
import classnames from "classnames";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  const [logOutput, setLogOutput] = useState("");
  const [connectionSuccessful, setConnectionSuccessful] = useState(false);
  const [color, setColor] = useState({ r: 0, g: 0, b: 0 });
  const [colorPickerVisible, setColorPickerVisible] = useState(false);
  //const [hostName, setHostname]

  const appendLog = (txt: string) => {
    const newText = txt + "\r\n" + logOutput;
    setLogOutput(newText);
  };

  const doDropPetal = (petalNum: number) => {
    dropPetal(petalNum)
      .then((result) => {
        console.log(result);
        appendLog(result);
      })
      .catch((err) => {
        console.error("Error on doDropPetal");
        appendLog("NETWORK ERROR ON DROPPETAL");
        appendLog(err.message);
      });
  };

  const doChangeColor = (r: number, g: number, b: number) => {
    changeColor(r, g, b)
      .then((result) => {
        console.log(result);
        appendLog(result.data.message);
      })
      .catch((err) => {
        console.error("Error on doChangeColor");
        appendLog("NETWORK ERROR ON CHANGECOLOR");
        appendLog(err.message);
      });
  };

  const doTestConnectivity = () => {
    testConnectivity()
      .then((result) => {
        console.log(result);
        appendLog(result.data.message);
      })
      .catch((err) => {
        appendLog("ERROR ON CONNECTIVITY TEST");
      });
  };

  const doSetStemLight = (stemIsOn: boolean) => {
    setStemLight(stemIsOn)
      .then((result) => {
        console.log(result);
        appendLog(result.data.message);
      })
      .catch((err) => {
        appendLog("ERROR ON STEM LIGHT");
      });
  };

  useEffect(() => {
    // try to connect
    testConnectivity()
      .then((result) => {
        setConnectionSuccessful(true);
        setLogOutput("Ready!");
      })
      .catch((err) => {
        setConnectionSuccessful(false);
        setLogOutput(
          "ERROR: API service on device is not responding. Check that the python flask app is up and running."
        );
      });
  }, []);

  return (
    <div className="bg-gray-900">
      <Head>
        <title>Enchanted Rose</title>
        <meta name="description" content="Enchanted rose with falling petals" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className="flex flex-row">
          <div className="mb-3">
            <img
              src="/assets/rose.jpg"
              className={classnames(
                { "w-24 rounded-lg": true },
                { "opacity-10": !connectionSuccessful },
                { "opacity-100": connectionSuccessful }
              )}
            />
          </div>
        </div>

        <div className="mt-4 max-w-sm">
          <div className="mb-8">
            <div className="mb-4 w-full text-center font-extralight text-sm">
              Stem Light
            </div>
            <div className="flex justify-center">
              <ToggleSwitch
                onChange={(stemIsOn) => {
                  console.log(stemIsOn);
                  doSetStemLight(stemIsOn);
                }}
              />
            </div>
          </div>

          <div>
            <div className="w-full text-center font-extralight text-sm">
              Accent Color
            </div>

            <div className="mt-4 flex justify-start gap-4">
              <ColorButton
                currentColor={color}
                onClick={(colorResult) => {
                  setColor(colorResult);
                  doChangeColor(colorResult.r, colorResult.g, colorResult.b);
                }}
                color={{
                  r: 255,
                  g: 0,
                  b: 100,
                }}
              />
              <ColorButton
                currentColor={color}
                onClick={(colorResult) => {
                  setColor(colorResult);
                  doChangeColor(colorResult.r, colorResult.g, colorResult.b);
                }}
                color={{
                  r: 255,
                  g: 100,
                  b: 0,
                }}
              />
              <ColorButton
                currentColor={color}
                onClick={(colorResult) => {
                  setColor(colorResult);
                  doChangeColor(colorResult.r, colorResult.g, colorResult.b);
                }}
                color={{
                  r: 0,
                  g: 100,
                  b: 0,
                }}
              />
              <ColorButton
                currentColor={color}
                onClick={(colorResult) => {
                  setColor(colorResult);
                  doChangeColor(colorResult.r, colorResult.g, colorResult.b);
                }}
                color={{
                  r: 0,
                  g: 0,
                  b: 255,
                }}
              />
              <ColorButton
                currentColor={color}
                onClick={(colorResult) => {
                  setColor(colorResult);
                  doChangeColor(colorResult.r, colorResult.g, colorResult.b);
                }}
                color={{
                  r: 255,
                  g: 255,
                  b: 5,
                }}
              />
              <ColorButton
                currentColor={color}
                onClick={(colorResult) => {
                  setColor(colorResult);
                  doChangeColor(colorResult.r, colorResult.g, colorResult.b);
                }}
                color={{
                  r: 0,
                  g: 0,
                  b: 0,
                }}
              />
            </div>
          </div>

          <div>
            <div className="w-full text-center font-extralight text-sm">
              Petal Drop
            </div>
            <div className="mt-4 flex justify-center gap-6">
              <div>
                <Button
                  onClick={() => doDropPetal(1)}
                  iconObj={FaLeaf}
                  label="1"
                />
              </div>
              <div>
                <Button
                  onClick={() => doDropPetal(2)}
                  iconObj={FaLeaf}
                  label="2"
                />
              </div>
              <div>
                <Button
                  onClick={() => doDropPetal(3)}
                  iconObj={FaLeaf}
                  label="3"
                />
              </div>
              <div>
                <Button
                  onClick={() => doDropPetal(4)}
                  iconObj={FaLeaf}
                  label="4"
                />
              </div>
            </div>
          </div>

          <div className="mt-12 w-full mx-auto">
            <LogWindow
              onClearClicked={() => {
                setLogOutput("");
              }}
              text={logOutput}
            />
          </div>
          <div className="mt-2 flex justify-center">
            <Button
              onClick={() => {
                doTestConnectivity();
              }}
              iconObj={FaExchangeAlt}
              label="Test connection"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
