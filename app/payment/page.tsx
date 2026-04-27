import axios from "axios";
import { ClientPage } from "./Client";
import { prisma } from "@/prisma";
import { auth } from "@/auth";

export default async function Page() {
  const authData = await auth();
  const email = authData?.user?.email;
  if (!email) return;

  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  let id: string | null | undefined = user?.paddleId;

  if (id == null) {
    try {
      const {
        data: { data },
      } = await axios.post(
        `${process.env.PADDLE_API_URL}/customers`,
        {
          email,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.PADDLE_API_KEY}`,
          },
        },
      );

      id = data.id;

      await prisma.user.update({
        where: {
          email,
        },
        data: {
          paddleId: id,
        },
      });
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <ClientPage
      env={process.env.PADDLE_ENV as "production" | "sandbox"}
      token={process.env.PADDLE_CLIENT_TOKEN as string}
      email={email}
      id={id}
    />
  );
}
