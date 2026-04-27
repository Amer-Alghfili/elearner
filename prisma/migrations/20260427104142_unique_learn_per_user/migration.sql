/*
  Warnings:

  - A unique constraint covering the columns `[title,user_id]` on the table `learns` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "learns_title_key";

-- CreateIndex
CREATE UNIQUE INDEX "learns_title_user_id_key" ON "learns"("title", "user_id");
