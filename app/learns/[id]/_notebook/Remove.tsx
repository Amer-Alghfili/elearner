import React from "react";
import { deleteNotebook } from "./action";
import { useRouter } from "next/navigation";
import RemoveButton from "@/components/button/remove";
import { Button, Icon, Input } from "@chakra-ui/react";
import { LuTrash } from "react-icons/lu";

export function RemoveNotebook({ id }: { id: number }) {
  const [formState, action, loading] = React.useActionState(deleteNotebook, {});

  const router = useRouter();

  React.useEffect(
    function reload() {
      router.refresh();
    },
    [formState.data]
  );

  return (
    <RemoveButton
      className="group"
      _hover={{ bg: "stroke" }}
      h="auto"
      icon={
        <Icon color="accent.softCoral" w="1rem" h="1rem">
          <LuTrash />
        </Icon>
      }
    >
      <form onClick={(e) => e.stopPropagation()} action={action}>
        <Input id="id" name="id" value={id} hidden={true} readOnly={true} />
        <Button type="submit" loading={loading} bg="feedback.error">
          Delete
        </Button>
      </form>
    </RemoveButton>
  );
}
