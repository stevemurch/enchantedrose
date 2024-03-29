import { FaEraser } from "react-icons/fa";

export interface LogWindowProps {
  text: string;
  onClearClicked: () => void;
}

const LogWindow = (props: LogWindowProps) => {
  return (
    <>
      <div className="flex justify-between">
        <div className="text-sm font-extralight text-gray-300 mb-2">
          Device Output
        </div>
        <div
          onClick={() => {
            props.onClearClicked();
          }}
        >
          <FaEraser
            title="Clear the output log"
            className="w-4 h-4 text-gray-400 hover:text-gray-300 cursor-pointer"
          />
        </div>
      </div>
      <textarea
        value={props.text}
        onChange={() => {}}
        className="font-mono bg-gray-700 border border-black text-gray-400 p-2 text-sm h-24 rounded-md w-full"
      ></textarea>
    </>
  );
};

export default LogWindow;
