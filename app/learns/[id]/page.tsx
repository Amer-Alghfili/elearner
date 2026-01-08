import { prisma } from "@/prisma";
import { redirect } from "next/navigation";

export default async function LearnPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const learnId = Number(id);

  const files = await prisma.noteFile.findMany({
    where: {
      learn_id: learnId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  if (files.length) {
    redirect(`/learns/${learnId}/${files[files.length - 1].id.toString()}`);
  } else {
    //TODO: notebook empty state
    return <h1>Not fount</h1>;
  }
}
