/*
  Warnings:

  - You are about to drop the `flash_cards` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `learns_knowledge_tests` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `practice_tasks` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "flash_cards" DROP CONSTRAINT "flash_cards_knowledge_test_id_fkey";

-- DropForeignKey
ALTER TABLE "learns_knowledge_tests" DROP CONSTRAINT "learns_knowledge_tests_learn_id_fkey";

-- DropForeignKey
ALTER TABLE "practice_tasks" DROP CONSTRAINT "practice_tasks_knowledge_test_id_fkey";

-- DropTable
DROP TABLE "flash_cards";

-- DropTable
DROP TABLE "learns_knowledge_tests";

-- DropTable
DROP TABLE "practice_tasks";

-- CreateTable
CREATE TABLE "learns_flash_cards" (
    "id" SERIAL NOT NULL,
    "stage" VARCHAR(255) NOT NULL,
    "due" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "learn_id" INTEGER NOT NULL,
    "question" VARCHAR(255) NOT NULL,
    "answer_type" VARCHAR(255) NOT NULL,
    "answer" VARCHAR(255) NOT NULL,
    "hint" VARCHAR(255),
    "options" JSONB,

    CONSTRAINT "learns_flash_cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "learns_practice_tasks" (
    "id" SERIAL NOT NULL,
    "learn_id" INTEGER NOT NULL,
    "stage" VARCHAR(255) NOT NULL,
    "due" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255) NOT NULL,

    CONSTRAINT "learns_practice_tasks_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "learns_flash_cards" ADD CONSTRAINT "learns_flash_cards_learn_id_fkey" FOREIGN KEY ("learn_id") REFERENCES "learns"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learns_practice_tasks" ADD CONSTRAINT "learns_practice_tasks_learn_id_fkey" FOREIGN KEY ("learn_id") REFERENCES "learns"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
