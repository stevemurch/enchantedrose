import { Switch } from "@headlessui/react";
import classNames from "classnames";
import useStateRef from "react-usestateref";

export interface ToggleSwitchProps {
  onChange: (on: boolean) => void;
}

export default function ToggleSwitch(props: ToggleSwitchProps) {
  const [enabled, setEnabled, enabledRef] = useStateRef(false);

  return (
    <Switch
      checked={enabled}
      onChange={() => {
        setEnabled(!enabled);
        props.onChange(enabledRef.current);
      }}
      className={classNames(
        enabled ? "bg-indigo-600" : "bg-gray-200",
        "relative inline-flex h-8 w-16 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      )}
    >
      <span className="sr-only">Use setting</span>
      <span
        aria-hidden="true"
        className={classNames(
          enabled ? "translate-x-8" : "translate-x-0",
          "pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
        )}
      />
    </Switch>
  );
}
