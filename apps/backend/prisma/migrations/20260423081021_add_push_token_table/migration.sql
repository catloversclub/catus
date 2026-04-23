/*
  Warnings:

  - You are about to drop the column `report_count` on the `post` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "PushPlatform" AS ENUM ('ios', 'android');

-- AlterTable
ALTER TABLE "post" DROP COLUMN "report_count";

-- CreateTable
CREATE TABLE "push_token" (
    "token" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "platform" "PushPlatform" NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "last_used_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "push_token_pkey" PRIMARY KEY ("token")
);

-- CreateIndex
CREATE INDEX "push_token_user_id_idx" ON "push_token"("user_id");

-- AddForeignKey
ALTER TABLE "push_token" ADD CONSTRAINT "push_token_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
