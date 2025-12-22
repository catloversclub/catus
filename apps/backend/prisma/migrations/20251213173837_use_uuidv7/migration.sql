/*
  Warnings:

  - The primary key for the `comment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `post` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `post_image` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "public"."comment" DROP CONSTRAINT "comment_parent_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."comment" DROP CONSTRAINT "comment_post_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."comment_like" DROP CONSTRAINT "comment_like_comment_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."post_image" DROP CONSTRAINT "post_image_post_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."post_like" DROP CONSTRAINT "post_like_post_id_fkey";

-- AlterTable
ALTER TABLE "comment" DROP CONSTRAINT "comment_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "post_id" SET DATA TYPE TEXT,
ALTER COLUMN "parent_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "comment_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "comment_id_seq";

-- AlterTable
ALTER TABLE "comment_like" ALTER COLUMN "comment_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "post" DROP CONSTRAINT "post_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "post_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "post_id_seq";

-- AlterTable
ALTER TABLE "post_image" DROP CONSTRAINT "post_image_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "post_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "post_image_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "post_image_id_seq";

-- AlterTable
ALTER TABLE "post_like" ALTER COLUMN "post_id" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "post_image" ADD CONSTRAINT "post_image_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_like" ADD CONSTRAINT "post_like_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment_like" ADD CONSTRAINT "comment_like_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
