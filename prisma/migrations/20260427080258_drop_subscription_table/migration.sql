/*
  Warnings:

  - You are about to drop the `subscriptions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "subscriptions" DROP CONSTRAINT "subscriptions_user_email_fkey";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "paddle_id" VARCHAR(255);

-- DropTable
DROP TABLE "subscriptions";
