import { checkboxAnatomy } from "@chakra-ui/react/anatomy";
import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

export const checkbox = defineSlotRecipe({
  slots: checkboxAnatomy.keys(),
  className: "chakra-checkbox",

  variants: {
    variant: {
      solid: {
        control: {
          borderColor: "stroke",
          _checked: {
            bg: "primary",
            borderColor: "transparent",
            _hover: {
              bg: "primary.thick",
            },
          },
          _hover: {
            borderColor: "stroke.thick",
          },
        },
      },
    },
  },

  defaultVariants: {
    variant: "solid",
  },
});
