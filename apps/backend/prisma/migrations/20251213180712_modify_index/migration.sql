/*
  Warnings:

  - The primary key for the `comment_like` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `comment_like` table. All the data in the column will be lost.
  - The primary key for the `post_like` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `post_like` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."cat_butlerId_created_at_idx";

-- DropIndex
DROP INDEX "public"."comment_parent_id_createdAt_idx";

-- DropIndex
DROP INDEX "public"."comment_post_id_createdAt_idx";

-- DropIndex
DROP INDEX "public"."comment_like_comment_id_user_id_key";

-- DropIndex
DROP INDEX "public"."post_butler_id_created_at_idx";

-- DropIndex
DROP INDEX "public"."post_cat_id_created_at_idx";

-- DropIndex
DROP INDEX "public"."post_created_at_id_idx";

-- DropIndex
DROP INDEX "public"."post_image_post_id_idx";

-- DropIndex
DROP INDEX "public"."post_like_post_id_user_id_key";

-- AlterTable
ALTER TABLE "comment_like" DROP CONSTRAINT "comment_like_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "comment_like_pkey" PRIMARY KEY ("comment_id", "user_id");

-- AlterTable
ALTER TABLE "post_like" DROP CONSTRAINT "post_like_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "post_like_pkey" PRIMARY KEY ("post_id", "user_id");

-- CreateIndex
CREATE INDEX "cat_butlerId_id_idx" ON "cat"("butlerId", "id");

-- CreateIndex
CREATE INDEX "comment_post_id_id_idx" ON "comment"("post_id", "id");

-- CreateIndex
CREATE INDEX "comment_parent_id_id_idx" ON "comment"("parent_id", "id");

-- CreateIndex
CREATE INDEX "post_butler_id_id_idx" ON "post"("butler_id", "id");

-- CreateIndex
CREATE INDEX "post_cat_id_id_idx" ON "post"("cat_id", "id");
