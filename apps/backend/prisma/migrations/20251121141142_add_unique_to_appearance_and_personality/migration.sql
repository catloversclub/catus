/*
  Warnings:

  - A unique constraint covering the columns `[label]` on the table `appearance` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[label]` on the table `personality` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "appearance_label_key" ON "appearance"("label");

-- CreateIndex
CREATE UNIQUE INDEX "personality_label_key" ON "personality"("label");
