import { domine } from "@/fonts";
import { Box, Button, Flex } from "@chakra-ui/react";
import { ExitIcon } from "./Icons";
import { signOut } from "@/auth";

export default function Header() {
  return (
    <Flex alignItems="center" gap="2em" justifyContent="space-between">
      <Box {...domine} fontSize="3.625rem" fontWeight="bold" color="primary">
        Elearner
      </Box>
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/login" });
        }}
      >
        <Button type="submit" variant="plain" color="primary" fontWeight="bold">
          <ExitIcon />
          Logout
        </Button>
      </form>
    </Flex>
  );
}
