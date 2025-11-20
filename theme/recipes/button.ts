import { defineRecipe } from "@chakra-ui/react";

export const button = defineRecipe({
  base: {
    borderRadius: "8px",
    textStyle: "md-medium",
    px: "1rem",
  },
  variants: {
    size: {
      sm: {
        py: "0.5625rem",
      },
      md: {
        py: "0.8125rem",
      },
      lg: {
        py: "1.0625rem",
      },
    },
    variant: {
      primary: {
        bg: "primary",
      },
    },
  },
});
