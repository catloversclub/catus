/*
  Warnings:

  - The primary key for the `follow` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[follower_id,following_id]` on the table `follow` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "follow" DROP CONSTRAINT "follow_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "follow_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "follow_follower_id_following_id_key" ON "follow"("follower_id", "following_id");
