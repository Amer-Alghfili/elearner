-- CreateTable
CREATE TABLE "learns_todos" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255),
    "learn_id" INTEGER NOT NULL,

    CONSTRAINT "learns_todos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "learns_todos" ADD CONSTRAINT "learns_todos_learn_id_fkey" FOREIGN KEY ("learn_id") REFERENCES "learns"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
