import { defineRecipe } from "@chakra-ui/react";

export const button = defineRecipe({
  base: {
    borderRadius: "8px",
    px: "1rem",
  },
  variants: {
    size: {
      sm: {
        py: "0.5625rem",
        textStyle: "md-bold",
      },
      md: {
        py: "0.8125rem",
        textStyle: "md-bold",
      },
      lg: {
        py: "1.0625rem",
        textStyle: "md-bold",
      },
    },
    variant: {
      primary: {
        bg: "primary",
        color: "white",
      },
      secondary: {
        bg: "transparent",
        borderW: "1px",
        borderStyle: "solid",
        borderColor: "primary",
        color: "primary",
      },
      tertiary: {
        p: 0,
        bg: "transparent",
        color: "primary",
      },
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});
