import { IconType } from "react-icons";
import React from "react";

export interface ButtonProps {
  label: string;
  iconObj: IconType;
}

const Button = (props: ButtonProps) => {
  return (
    <>
      <button className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
        <span>{React.createElement(props.iconObj)}</span>
        <span className="ml-2">{props.label}</span>
      </button>
    </>
  );
};

export default Button;
