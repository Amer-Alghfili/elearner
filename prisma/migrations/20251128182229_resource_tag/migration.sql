-- AlterTable
ALTER TABLE "learns_resources" ALTER COLUMN "tags" DROP NOT NULL;

-- CreateTable
CREATE TABLE "resource_tags" (
    "id" SERIAL NOT NULL,
    "label" VARCHAR(255) NOT NULL,
    "color" VARCHAR(255) NOT NULL,
    "learn_id" INTEGER NOT NULL,

    CONSTRAINT "resource_tags_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "resource_tags" ADD CONSTRAINT "resource_tags_learn_id_fkey" FOREIGN KEY ("learn_id") REFERENCES "learns"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
