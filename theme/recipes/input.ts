import { defineRecipe } from "@chakra-ui/react";

export const input = defineRecipe({
  variants: {
    size: {
      sm: {
        fontSize: "1rem",
        py: "0.65625rem",
      },
      md: {
        fontSize: "1.125rem",
        py: "0.78125rem",
      },
      lg: {
        fontSize: "1.25rem",
        py: "0.9375rem",
      },
    },
    variant: {
      outline: {
        borderRadius: "8px",
        textStyle: "md-medium",
        bg: "white",
        px: "1rem",
        _placeholder: {
          color: "#6C6C6C",
        },
      },
    },
  },
});
