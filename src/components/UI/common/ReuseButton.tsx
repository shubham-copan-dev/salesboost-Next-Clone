import { Button } from "@chakra-ui/react";

function ReuseButton({ variantType, text, handleClick, px, py, fs, h }: any) {
  const baseProperties = {
    size: "sm",
    borderRadius: "sm",
    pt: "px",
    pb: "px",
    ps: "1",
    pe: "1",

    fontWeight: "medium",
    lineHeight: "1px",
    cursor: "default",
  };

  let dynamicProperties;

  switch (variantType) {
    case "primary":
      dynamicProperties = {
        color: "bgClr.NeutralColorWhite",
        bg: "bgClr.PrimaryActions",
        variant: "primary",
        fontSize: fs,
        size: "lg",
        px: px,
        py: py,
        h: h,
        borderRadius: "8",
        cursor: "pointer",
      };
      break;

    case "secondary":
      dynamicProperties = {
        color: "bgClr.LightLow",
        bg: "#f19100",
        variant: "secondary",
        fontSize: "xs",

        // Add more properties for the "secondary" variant
      };
      break;

    case "outline":
      dynamicProperties = {
        color: "BaseClr.LightSecondary",
        bg: "transparent",
        variant: "outline",
        border: "1px",
        borderColor: "BaseClr.LightSecondary",
        fontSize: "xs",
      };
      break;

    case "apply":
      dynamicProperties = {
        color: "bgClr.LightLow",
        variant: "primary",
        fontSize: "sm",
        bg: "hoverClr.primaryHover",
        p: "2",
      };
      break;
    case "discard":
      dynamicProperties = {
        color: "hoverClr.primaryHover",
        variant: "primary",
        fontSize: "sm",
        border: "1px",
        bg: "bgClr.LightLow",
        p: "2",
      };
      break;

    default:
      return "";
  }

  const mergedProperties = { ...baseProperties, ...dynamicProperties };

  return (
    <Button {...mergedProperties} onClick={handleClick}>
      {text}
    </Button>
  );
}

export default ReuseButton;
