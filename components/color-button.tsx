import classNames from "classnames";

export interface ColorButtonProps {
  currentColor: { r: number; g: number; b: number };
  onClick: (color: { r: number; g: number; b: number }) => void;
  color: { r: number; g: number; b: number };
}

const ColorButton = (props: ColorButtonProps) => {
  const isCurrentColor = (): boolean => {
    return (
      props.currentColor.r == props.color.r &&
      props.currentColor.g == props.color.g &&
      props.currentColor.b == props.color.b
    );
  };

  return (
    <div>
      <div
        onClick={() => {
          props.onClick(props.color);
        }}
        title=""
        className={classNames(
          "mb-3 cursor-pointer w-12 h-12 inline-block rounded-full",
          { "ring-8": isCurrentColor() },
          { "ring-2": !isCurrentColor() }
        )}
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
      >
        {props.color.r == 0 && props.color.g == 0 && props.color.b == 0 && (
          <span className="relative top-3 left-3 font-extralight">off</span>
        )}
      </div>
    </div>
  );
};

export default ColorButton;
