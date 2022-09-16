import { useState } from "react";

export interface LogWindowProps {
  text: string;
}

const LogWindow = (props: LogWindowProps) => {
  return (
    <>
      <div className="text-xs font-extralight text-gray-300 mb-2">
        Device Output
      </div>
      <textarea
        value={props.text}
        onChange={() => {}}
        className="bg-gray-700 border border-black text-gray-400 p-2 text-sm h-24 rounded-md w-full"
      ></textarea>
    </>
  );
};

export default LogWindow;
