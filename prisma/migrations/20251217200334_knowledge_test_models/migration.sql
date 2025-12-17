/*
  Warnings:

  - You are about to drop the column `answer` on the `learns_knowledge_tests` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `learns_knowledge_tests` table. All the data in the column will be lost.
  - You are about to drop the column `hints` on the `learns_knowledge_tests` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `learns_knowledge_tests` table. All the data in the column will be lost.
  - You are about to drop the column `knowledge_test_id` on the `learns_resources` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "learns_resources" DROP CONSTRAINT "learns_resources_knowledge_test_id_fkey";

-- AlterTable
ALTER TABLE "learns_knowledge_tests" DROP COLUMN "answer",
DROP COLUMN "description",
DROP COLUMN "hints",
DROP COLUMN "title";

-- AlterTable
ALTER TABLE "learns_resources" DROP COLUMN "knowledge_test_id";

-- CreateTable
CREATE TABLE "flash_cards" (
    "id" SERIAL NOT NULL,
    "knowledge_test_id" INTEGER NOT NULL,
    "question" VARCHAR(255) NOT NULL,
    "answer_type" VARCHAR(255) NOT NULL,
    "answer" VARCHAR(255) NOT NULL,
    "hint" VARCHAR(255),
    "options" JSONB,

    CONSTRAINT "flash_cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "practice_tasks" (
    "id" SERIAL NOT NULL,
    "knowledge_test_id" INTEGER NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255) NOT NULL,

    CONSTRAINT "practice_tasks_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "flash_cards" ADD CONSTRAINT "flash_cards_knowledge_test_id_fkey" FOREIGN KEY ("knowledge_test_id") REFERENCES "learns_knowledge_tests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "practice_tasks" ADD CONSTRAINT "practice_tasks_knowledge_test_id_fkey" FOREIGN KEY ("knowledge_test_id") REFERENCES "learns_knowledge_tests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
