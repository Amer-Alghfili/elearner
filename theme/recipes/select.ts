import { defineSlotRecipe } from "@chakra-ui/react";
import { selectAnatomy } from "@chakra-ui/react/anatomy";
import { input } from "./input";

export const select = defineSlotRecipe({
  className: "chakra-select",
  slots: selectAnatomy.keys(),
  base: {
    label: {
      color: "text.secondary",
      textStyle: "md-semibold",
    },
    trigger: {
      height: "2.25rem",
      ...input.variants?.variant.outline,
      fontWeight: "medium",
    },
  },

  variants: {
    size: {
      sm: {
        trigger: {
          fontSize: "clamp(0.875rem, 1.5625vw, 1rem)",
          py: "0.65625rem",
        },
      },
      md: {
        trigger: {
          fontSize: "clamp(1rem, 1.7578vw, 1.125rem)",
          py: "0.78125rem",
        },
      },
      lg: {
        trigger: {
          fontSize: "clamp(1rem, 1.9531vw, 1.25rem)",
          py: "0.9375rem",
        },
      },
    },
    variant: {
      outline: {
        trigger: {
          bg: "transparent",
          borderWidth: "1px",
          borderColor: "border",
          _expanded: {
            borderColor: "border.emphasized",
          },
        },
      },
    },
  },

  defaultVariants: {
    variant: "outline",
  },
});
