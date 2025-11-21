/*
  Warnings:

  - You are about to drop the column `appearance` on the `cat` table. All the data in the column will be lost.
  - You are about to drop the column `personality` on the `cat` table. All the data in the column will be lost.
  - You are about to drop the column `favorite_appearance` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `favorite_personality` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "cat" DROP COLUMN "appearance",
DROP COLUMN "personality";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "favorite_appearance",
DROP COLUMN "favorite_personality";

-- CreateTable
CREATE TABLE "appearance" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "appearance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "personality" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "personality_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CatToPersonality" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_CatToPersonality_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_AppearanceToUser" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AppearanceToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_AppearanceToCat" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AppearanceToCat_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_PersonalityToUser" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PersonalityToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CatToPersonality_B_index" ON "_CatToPersonality"("B");

-- CreateIndex
CREATE INDEX "_AppearanceToUser_B_index" ON "_AppearanceToUser"("B");

-- CreateIndex
CREATE INDEX "_AppearanceToCat_B_index" ON "_AppearanceToCat"("B");

-- CreateIndex
CREATE INDEX "_PersonalityToUser_B_index" ON "_PersonalityToUser"("B");

-- AddForeignKey
ALTER TABLE "_CatToPersonality" ADD CONSTRAINT "_CatToPersonality_A_fkey" FOREIGN KEY ("A") REFERENCES "cat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CatToPersonality" ADD CONSTRAINT "_CatToPersonality_B_fkey" FOREIGN KEY ("B") REFERENCES "personality"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AppearanceToUser" ADD CONSTRAINT "_AppearanceToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "appearance"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AppearanceToUser" ADD CONSTRAINT "_AppearanceToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AppearanceToCat" ADD CONSTRAINT "_AppearanceToCat_A_fkey" FOREIGN KEY ("A") REFERENCES "appearance"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AppearanceToCat" ADD CONSTRAINT "_AppearanceToCat_B_fkey" FOREIGN KEY ("B") REFERENCES "cat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PersonalityToUser" ADD CONSTRAINT "_PersonalityToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "personality"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PersonalityToUser" ADD CONSTRAINT "_PersonalityToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
