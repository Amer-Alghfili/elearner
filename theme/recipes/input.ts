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
        transition: "all 0.1s ease-in-out",
        borderRadius: "8px",
        textStyle: "md-medium",
        borderColor: "stroke",
        bg: "white",
        px: "1rem",
        color: "text.primary",
        _placeholder: {
          color: "#6C6C6C",
        },
        _hover: {
          bg: "stroke.transparent",
        },
      },
      plain: {
        h: "auto",
        p: 0,
        bg: "transparent",
      },
    },
  },
});
