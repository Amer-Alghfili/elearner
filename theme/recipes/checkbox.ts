import { checkboxAnatomy } from "@chakra-ui/react/anatomy";
import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

export const checkbox = defineSlotRecipe({
  slots: checkboxAnatomy.keys(),
  className: "chakra-checkbox",

  variants: {
    variant: {
      solid: {
        control: {
          bg: "stroke",
          border: "none",
          _checked: {
            bg: "primary",
            _hover: {
              bg: "primary.thick",
            },
          },
          _hover: {
            bg: "stroke.thick",
          },
        },
      },
    },
  },

  defaultVariants: {
    variant: "solid",
  },
});
