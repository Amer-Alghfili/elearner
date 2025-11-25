-- CreateTable
CREATE TABLE "learns_resources" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255),
    "link" VARCHAR(255),
    "file" VARCHAR(255),
    "tags" JSON NOT NULL,
    "learn_id" INTEGER NOT NULL,

    CONSTRAINT "learns_resources_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "learns_resources" ADD CONSTRAINT "learns_resources_learn_id_fkey" FOREIGN KEY ("learn_id") REFERENCES "learns"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
