/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `learns` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "learns_title_key" ON "learns"("title");
