import { domine } from "@/fonts";
import { Button, Flex, Link } from "@chakra-ui/react";
import { ExitIcon } from "./Icons";
import { signOut } from "@/auth";

export default function Header() {
  return (
    <Flex alignItems="center" gap="2em" justifyContent="space-between">
      <Link
        href="/home"
        {...domine}
        fontSize="3.625rem"
        fontWeight="bold"
        color="primary"
        textDecoration="none"
      >
        Elearner
      </Link>
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
