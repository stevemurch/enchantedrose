export interface ColorButtonProps {
  onClick: (color: { r: number; g: number; b: number }) => void;
  color: { r: number; g: number; b: number };
}

const ColorButton = (props: ColorButtonProps) => {
  return (
    <div>
      <div
        onClick={() => {
          props.onClick(props.color);
        }}
        title=""
        className="ring-2 mb-3 cursor-pointer w-12 h-12 inline-block rounded-full"
        style={{
          background:
            "rgb(" +
            props.color.r +
            "," +
            props.color.g +
            "," +
            props.color.b +
            ")",
        }}
      ></div>
    </div>
  );
};

export default ColorButton;
