import { defineSlotRecipe } from "@chakra-ui/react";
import { fieldAnatomy } from "@chakra-ui/react/anatomy";

export const field = defineSlotRecipe({
  className: "chakra-field",
  slots: fieldAnatomy.keys(),
  base: {
    label: {
      textStyle: "md-medium",
      color: "text.secondary",
    },
  },
});
