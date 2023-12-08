import { defineStyleConfig } from '@chakra-ui/react';

const buttonStyle = defineStyleConfig({
  // The styles all buttons have in common
  baseStyle: {
    size: 'sm',
    borderRadius: 'sm',
    pt: 'px',
    pb: 'px',
    ps: '1',
    pe: '1',
    fontWeight: 'medium',
    lineHeight: '1px',
    cursor: 'default',
  },
  // Two sizes: sm and md
  sizes: {
    // sm: {
    //   fontSize: 'sm',
    //   px: 4,
    //   py: 3,
    // },
    // md: {
    //   fontSize: 'md',
    //   px: 6,
    //   py: 4,
    // },
  },
  // Two variants: outline and solid
  variants: {
    primary: {
      color: 'bgClr.LightLow',
      bg: '#36b984',
      variant: 'primary',
      fontSize: 'xs',
    },

    secondary: {
      color: 'bgClr.LightLow',
      bg: '#f19100',
      variant: 'secondary',
      fontSize: 'xs',
    },

    outline: {
      color: 'BaseClr.LightSecondary',
      bg: 'transparent',
      variant: 'outline',
      border: '1px',
      borderColor: 'BaseClr.LightSecondary',
      fontSize: 'xs',
    },

    apply: {
      color: 'bgClr.LightLow',
      fontSize: 'sm',
      bg: 'hoverClr.primaryHover',
      p: '2',
    },
    discard: {
      color: 'hoverClr.primaryHover',
      fontSize: 'sm',
      border: '1px',
      bg: 'bgClr.LightLow',
      p: '2',
    },
  },
  // The default size and variant values
  defaultProps: {},
});

const btnStyle = {
  display: "flex",
  padding: "12px 10px",
  alignItems: "center",
  gap: "6px",
  borderRadius: "8px 8px 0px 0px",
  background: "bgClr.Grey200", // Assuming bgClr.Grey200 refers to a Chakra UI color token
  boxShadow: "0px 1px 20px 0px rgba(233, 234, 239, 0.90)",
  color: "#394256",
  fontSize: "13px",
  fontStyle: "normal",
  fontWeight: "500",
  lineHeight: "130%"
};

export {btnStyle};
export default buttonStyle;
