import { defineSlotRecipe } from "@chakra-ui/react";
import { radioCardAnatomy } from "@chakra-ui/react/anatomy";

export const radioCard = defineSlotRecipe({
  className: "chakra-radio-card",
  slots: radioCardAnatomy.keys(),
  base: {
    label: {
      textStyle: "md-medium",
      color: "text.secondary",
    },
    itemText: {
      textStyle: "sm-semibold",
      color: "text.secondary",
      textAlign: "center",
      _checked: {
        textStyle: "sm-bold",
        color: "primary.thick",
      },
    },
    itemContent: {
      gap: "1.5em",
      alignItems: "center",
    },
  },
});
