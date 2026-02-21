import { defineSlotRecipe } from "@chakra-ui/react";
import { progressAnatomy } from "@chakra-ui/react/anatomy";

export const progress = defineSlotRecipe({
  slots: progressAnatomy.keys(),
  className: "chakra-progress",
  base: {
    range: {
      bg: "primary",
    },
  },
});
