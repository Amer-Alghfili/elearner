import { MenuContent, MenuContextTrigger, MenuItem, MenuRoot } from "./ui/menu";
import {
  MenuContentProps,
  MenuContextTriggerProps,
  MenuItemProps,
  MenuRootProps,
} from "@chakra-ui/react";

type MenuContextProps = {
  triggerProps?: MenuContextTriggerProps;
  contentProps?: MenuContentProps;
  list: MenuItemProps[];
} & MenuRootProps;
export default function MenuContext({
  triggerProps,
  contentProps,
  list,
  ...props
}: MenuContextProps) {
  return (
    <MenuRoot {...props}>
      <MenuContextTrigger {...triggerProps}>
        {props.children}
      </MenuContextTrigger>
      <MenuContent {...contentProps}>
        {list.map((item) => (
          <MenuItem key={item.value} {...item} />
        ))}
      </MenuContent>
    </MenuRoot>
  );
}
