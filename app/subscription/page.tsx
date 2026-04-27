import axios from "axios";
import { prisma } from "@/prisma";
import { auth } from "@/auth";
import Header from "@/components/Header";
import { Scaffold } from "@/components/Scaffold";

export default async function Page() {
  const authData = await auth();
  const email = authData?.user?.email;
  if (!email) return;

  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  let paddleId: string | null | undefined = user?.paddleId;

  if (paddleId == null) {
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

      paddleId = data.id;

      await prisma.user.update({
        where: {
          email,
        },
        data: {
          paddleId,
        },
      });
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <Scaffold>
      <Header />
    </Scaffold>
  );
}
