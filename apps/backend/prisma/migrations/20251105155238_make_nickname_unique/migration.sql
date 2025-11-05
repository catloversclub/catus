/*
  Warnings:

  - A unique constraint covering the columns `[nickname]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "user_nickname_key" ON "user"("nickname");
