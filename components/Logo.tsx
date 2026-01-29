import { domine } from "@/fonts";
import { Link } from "@chakra-ui/react";

export function Logo({ short = false }: { short?: boolean }) {
  if (short) {
    return (
      <Link
        href="/home"
        {...domine}
        fontSize="clamp(2rem, 3vw, 3.625rem)"
        fontWeight="bold"
        color="primary"
        textDecoration="none"
      >
        E
      </Link>
    );
  }

  return (
    <Link
      href="/home"
      {...domine}
      fontSize="clamp(2rem, 3vw, 3.625rem)"
      fontWeight="bold"
      color="primary"
      textDecoration="none"
    >
      Elearner
    </Link>
  );
}
