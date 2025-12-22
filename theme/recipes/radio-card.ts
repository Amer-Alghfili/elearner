import { defineSlotRecipe } from "@chakra-ui/react";
import { radioCardAnatomy } from "@chakra-ui/react/anatomy";

export const radioCard = defineSlotRecipe({
  className: "chakra-radio-card",
  slots: radioCardAnatomy.keys(),
  base: {
    item: {
      boxShadow: "none !important",
      transition: "all 0.2s ease-in-out",
      borderRadius: "12px",
    },
    label: {
      textStyle: "md-medium",
      color: "text.secondary",
    },
    itemText: {
      textStyle: "sm-semibold",
      color: "text.secondary",
      _checked: {
        color: "primary.thick",
      },
    },
    itemControl: {
      alignItems: "center",
    },
    itemContent: {
      gap: "1em",
      alignItems: "center",
    },
  },
  variants: {
    variant: {
      outline: {
        item: {
          borderWidth: "2px",
          _checked: {
            bg: "primary.transparent",
            borderColor: "primary",
          },
        },
      },
    },
    orientation: {
      vertical: {
        itemControl: { flexDirection: "column" },
        itemContent: { flexDirection: "column" },
      },
      horizontal: {
        itemControl: { flexDirection: "row" },
        itemContent: { flexDirection: "row" },
      },
    },
  },
  defaultVariants: {
    variant: "outline",
    orientation: "horizontal",
  },
});
