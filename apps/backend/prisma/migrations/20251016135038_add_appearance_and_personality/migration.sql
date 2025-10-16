/*
  Warnings:

  - You are about to drop the column `favoriteType` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "cat" ADD COLUMN     "appearance" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
ADD COLUMN     "personality" INTEGER[] DEFAULT ARRAY[]::INTEGER[];

-- AlterTable
ALTER TABLE "user" DROP COLUMN "favoriteType",
ADD COLUMN     "favorite_appearance" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
ADD COLUMN     "favorite_personality" INTEGER[] DEFAULT ARRAY[]::INTEGER[];
