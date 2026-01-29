"use client";

import { Logo } from "@/components/Logo";
import {
  Collapsible,
  Flex,
  IconButton,
  Stack,
  Link,
  IconProps,
  LinkProps,
} from "@chakra-ui/react";
import NextLink from "next/link";
import {
  BulbWithFolderIcon,
  BurgerIcon,
  KeyboardIcon,
  LinkWithFolderIcon,
  NotebookIcon,
} from "@/components/Icons";
import { LuChevronRight } from "react-icons/lu";
import { NotebookType } from "../[notebookId]";
import React from "react";
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu";
import { usePathname } from "next/navigation";

const SidebarContext = React.createContext<{ open: boolean }>({ open: true });
function useSidebar() {
  return React.useContext(SidebarContext);
}

export function SidebarContent({ notebooks }: { notebooks: NotebookType[] }) {
  const [open, setOpen] = React.useState(true);

  const width = open ? "20rem" : "4rem";

  return (
    <Stack
      position="fixed"
      top={0}
      bottom={0}
      left={0}
      overflow="auto"
      w={width}
      px={open ? "1.5em" : 0}
      pt="2em"
      gap="2em"
      borderWidth="1px"
      borderColor="stroke"
      bg="neutral.surface"
      transition="width 0.3s ease-in-out"
    >
      <Flex
        gap="1em"
        justifyContent="space-between"
        alignItems="center"
        flexDirection={open ? "row" : "column"}
      >
        <Logo short={!open} />
        <IconButton
          h="auto"
          border="none"
          variant="plain"
          onClick={() => setOpen((prev) => !prev)}
        >
          <BurgerIcon />
        </IconButton>
      </Flex>
      <SidebarContext.Provider value={{ open }}>
        <Stack alignItems={open ? "flex-start" : "center"} gap="1.5em">
          <SidebarLinksGroup
            icon={<NotebookIcon />}
            subLinks={notebooks.map((notebook) => (
              <SidebarSubLink key={notebook.id} href={notebook.id.toString()}>
                {notebook.title}
              </SidebarSubLink>
            ))}
          >
            Notebooks
          </SidebarLinksGroup>
          <SidebarLinksGroup icon={<BulbWithFolderIcon />} subLinks={[]}>
            Flashcards
          </SidebarLinksGroup>
          <SidebarLinksGroup icon={<KeyboardIcon />} subLinks={[]}>
            Practice Tasks
          </SidebarLinksGroup>
          <SidebarLinksGroup icon={<LinkWithFolderIcon />} subLinks={[]}>
            Resources
          </SidebarLinksGroup>
        </Stack>
      </SidebarContext.Provider>
    </Stack>
  );
}

function SidebarLinksGroup({
  subLinks,
  icon,
  children,
}: {
  subLinks: React.ReactNode[];
  icon: React.ReactElement<IconProps>;
  children: React.ReactNode;
}) {
  const { open } = useSidebar();

  if (!subLinks.length) {
    return <SidebarLink icon={icon}>{children}</SidebarLink>;
  }

  if (open) {
    return (
      <Collapsible.Root w={open ? "full" : "auto"} textStyle="md-semibold">
        <Collapsible.Trigger
          w="full"
          justifyContent="space-between"
          cursor="pointer"
          display="flex"
          alignItems="center"
          gap="0.5rem"
        >
          <SidebarLink icon={icon}>{children}</SidebarLink>
          {open && (
            <Collapsible.Indicator
              transition="transform 0.2s"
              color="text.secondary"
              _open={{ transform: "rotate(90deg)" }}
            >
              <LuChevronRight />
            </Collapsible.Indicator>
          )}
        </Collapsible.Trigger>
        <Collapsible.Content mt="0.7em" ms="1rem">
          <Stack>{subLinks}</Stack>
        </Collapsible.Content>
      </Collapsible.Root>
    );
  }

  return (
    <MenuRoot>
      <MenuTrigger>
        <SidebarLink icon={icon}>{children}</SidebarLink>
      </MenuTrigger>
      <MenuContent>
        {subLinks.map((subLink, index) => (
          <MenuItem
            key={index}
            value={index.toString()}
            p={0}
            borderRadius="8px"
            _hover={{ bg: "transparent" }}
          >
            {subLink}
          </MenuItem>
        ))}
      </MenuContent>
    </MenuRoot>
  );
}

function SidebarLink({
  icon,
  children,
}: {
  icon: React.ReactElement<IconProps>;
  children: React.ReactNode;
}) {
  const { open } = useSidebar();

  const mappedIcon = React.cloneElement(icon, {
    stroke: "text.secondary",
  });

  if (!open) return mappedIcon;

  return (
    <Flex
      cursor="pointer"
      color="text.secondary"
      textStyle="md-semibold"
      gap="0.5em"
      alignItems="center"
    >
      {mappedIcon}
      {children}
    </Flex>
  );
}

function SidebarSubLink(props: LinkProps) {
  const pathname = usePathname();

  const isActive = pathname.endsWith(props.href as string);

  return (
    <Link
      asChild
      w="full"
      textStyle="sm-semibold"
      textDecoration="none"
      outline="none"
      py="0.3em"
      px="1em"
      borderRadius="8px"
      bg={isActive ? "stroke.transparent" : "transparent"}
      _hover={{
        bg: "stroke.transparent",
      }}
      {...props}
    >
      <NextLink href={props.href as any}>{props.children}</NextLink>
    </Link>
  );
}
