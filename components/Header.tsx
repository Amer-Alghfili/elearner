import { Button, Flex, IconButton, Link } from "@chakra-ui/react";
import { ExitIcon } from "./Icons";
import { logout } from "@/auth";
import { Logo } from "./Logo";
import { Alert } from "./ui/alert";
import { FaRegLightbulb } from "react-icons/fa6";
import { LuExternalLink } from "react-icons/lu";
import NextLink from "next/link";
import FeedbackButton from "./FeedbackButton";

export default function Header({
  withLogo = true,
  knowledgeItemsCount = 0,
}: {
  withLogo?: boolean;
  knowledgeItemsCount?: number;
}) {
  return (
    <Flex alignItems="center" gap="2em" justifyContent="space-between">
      {withLogo && <Logo />}
      {knowledgeItemsCount > 0 && (
        <Alert
          status="warning"
          title="You have pending items to review"
          icon={<FaRegLightbulb />}
          alignItems="center"
          endElement={
            <Link asChild>
              <NextLink href="/review-learns">
                <IconButton variant="plain">
                  <LuExternalLink />
                </IconButton>
              </NextLink>
            </Link>
          }
        />
      )}
      <Flex ms="auto" display="flex" alignItems="center" gap="2em">
        <Link asChild>
          <NextLink href="/subscription">Subscription</NextLink>
        </Link>
        <FeedbackButton />
        <form action={logout}>
          <Button
            type="submit"
            variant="plain"
            color="primary"
            fontWeight="bold"
          >
            <ExitIcon />
            Logout
          </Button>
        </form>
      </Flex>
    </Flex>
  );
}
