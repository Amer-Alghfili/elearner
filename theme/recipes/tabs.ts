import { defineSlotRecipe } from "@chakra-ui/react";
import { tabsAnatomy } from "@chakra-ui/react/anatomy";

export const tabs = defineSlotRecipe({
  slots: tabsAnatomy.keys(),
  className: "chakra-tabs",
  variants: {
    variant: {
      line: {
        trigger: {
          _selected: {
            color: "primary",
            fontWeight: "bold !important",
            _before: {
              bg: "primary !important",
            },
          },
        },
      },
    },
  },
  defaultVariants: {
    variant: "line",
  },
});
