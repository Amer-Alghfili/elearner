import RemoveButton from "@/components/button/remove";
import { Button, Input } from "@chakra-ui/react";
import React from "react";
import { deletePracticeTask } from "./actions";
import { useRouter } from "next/navigation";
import { toaster } from "@/components/ui/toaster";

export function Remove({ id }: { id: number }) {
  const router = useRouter();

  const [state, action, loading] = React.useActionState(
    deletePracticeTask,
    undefined
  );

  React.useEffect(
    function reset() {
      if (state == null) return;

      if (state.error) {
        toaster.create({
          title: state.error,
          type: "error",
          closable: true,
        });

        return;
      }

      router.refresh();

      toaster.create({
        title: "Practice task has been deleted successfully",
        type: "success",
        closable: true,
      });
    },
    [state]
  );

  return (
    <RemoveButton className="group" _hover={{ bg: "stroke" }}>
      <form action={action}>
        <Input id="id" name="id" value={id} hidden={true} readOnly={true} />
        <Button type="submit" loading={loading} bg="feedback.error">
          Delete
        </Button>
      </form>
    </RemoveButton>
  );
}
