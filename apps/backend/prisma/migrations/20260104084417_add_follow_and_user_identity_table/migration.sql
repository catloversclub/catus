/*
  Warnings:

  - You are about to drop the column `butler_id` on the `post` table. All the data in the column will be lost.
  - Added the required column `author_id` to the `post` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Provider" AS ENUM ('APPLE', 'GOOGLE', 'KAKAO');

-- DropForeignKey
ALTER TABLE "public"."post" DROP CONSTRAINT "post_butler_id_fkey";

-- DropIndex
DROP INDEX "public"."post_butler_id_id_idx";

-- AlterTable
ALTER TABLE "post" DROP COLUMN "butler_id",
ADD COLUMN     "author_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "follow" (
    "follower_id" TEXT NOT NULL,
    "following_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "follow_pkey" PRIMARY KEY ("follower_id","following_id")
);

-- CreateTable
CREATE TABLE "user_identity" (
    "id" TEXT NOT NULL,
    "provider" "Provider" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "user_identity_pkey" PRIMARY KEY ("provider","id")
);

-- CreateIndex
CREATE INDEX "follow_follower_id_idx" ON "follow"("follower_id");

-- CreateIndex
CREATE INDEX "follow_following_id_idx" ON "follow"("following_id");

-- CreateIndex
CREATE INDEX "post_author_id_id_idx" ON "post"("author_id", "id");

-- AddForeignKey
ALTER TABLE "follow" ADD CONSTRAINT "follow_follower_id_fkey" FOREIGN KEY ("follower_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "follow" ADD CONSTRAINT "follow_following_id_fkey" FOREIGN KEY ("following_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_identity" ADD CONSTRAINT "user_identity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post" ADD CONSTRAINT "post_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
