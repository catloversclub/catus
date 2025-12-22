/*
  Warnings:

  - You are about to drop the column `createdAt` on the `cat` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "cat" DROP COLUMN "createdAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "createdAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "post" (
    "id" SERIAL NOT NULL,
    "like_count" INTEGER NOT NULL DEFAULT 0,
    "content" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "butler_id" TEXT NOT NULL,
    "cat_id" TEXT,

    CONSTRAINT "post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_image" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "post_id" INTEGER NOT NULL,

    CONSTRAINT "post_image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comment" (
    "id" SERIAL NOT NULL,
    "like_count" INTEGER NOT NULL DEFAULT 0,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "post_id" INTEGER NOT NULL,
    "author_id" TEXT NOT NULL,
    "parent_id" INTEGER,

    CONSTRAINT "comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_like" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "post_id" INTEGER NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "post_like_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comment_like" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "comment_id" INTEGER NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "comment_like_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "post_butler_id_created_at_idx" ON "post"("butler_id", "created_at");

-- CreateIndex
CREATE INDEX "post_cat_id_created_at_idx" ON "post"("cat_id", "created_at");

-- CreateIndex
CREATE INDEX "post_created_at_id_idx" ON "post"("created_at", "id");

-- CreateIndex
CREATE INDEX "post_image_post_id_idx" ON "post_image"("post_id");

-- CreateIndex
CREATE UNIQUE INDEX "post_image_post_id_order_key" ON "post_image"("post_id", "order");

-- CreateIndex
CREATE INDEX "comment_post_id_createdAt_idx" ON "comment"("post_id", "createdAt");

-- CreateIndex
CREATE INDEX "comment_parent_id_createdAt_idx" ON "comment"("parent_id", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "post_like_post_id_user_id_key" ON "post_like"("post_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "comment_like_comment_id_user_id_key" ON "comment_like"("comment_id", "user_id");

-- CreateIndex
CREATE INDEX "cat_butlerId_created_at_idx" ON "cat"("butlerId", "created_at");

-- AddForeignKey
ALTER TABLE "post" ADD CONSTRAINT "post_butler_id_fkey" FOREIGN KEY ("butler_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post" ADD CONSTRAINT "post_cat_id_fkey" FOREIGN KEY ("cat_id") REFERENCES "cat"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_image" ADD CONSTRAINT "post_image_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_like" ADD CONSTRAINT "post_like_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_like" ADD CONSTRAINT "post_like_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment_like" ADD CONSTRAINT "comment_like_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment_like" ADD CONSTRAINT "comment_like_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
