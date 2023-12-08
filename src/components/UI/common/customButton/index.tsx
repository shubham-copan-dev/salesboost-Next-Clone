import { Button, useStyleConfig } from "@chakra-ui/react";

function CustomButton({ variant, size, text, onClick }: any) {
  const styles = useStyleConfig("CustomButton", { variant }); // Apply the styles based on the variant
  console.log(variant, "styles:", styles);

  return (
    <Button
      __css={styles}
      size={size}
      onClick={onClick}
      // Add any other props you want to pass down
    >
      {text}
    </Button>
  );
}

export default CustomButton;
