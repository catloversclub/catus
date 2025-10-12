-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'UNKNOWN');

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "kakao_id" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "has_agreed_to_term" BOOLEAN NOT NULL DEFAULT false,
    "favoriteType" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "email" TEXT,
    "phone" TEXT,
    "profile_image_url" TEXT,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cat" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "gender" "Gender" NOT NULL DEFAULT 'UNKNOWN',
    "profile_image_url" TEXT,
    "birth_date" DATE,
    "breed" TEXT,
    "type" INTEGER,
    "butlerId" TEXT NOT NULL,

    CONSTRAINT "cat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_kakao_id_key" ON "user"("kakao_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- AddForeignKey
ALTER TABLE "cat" ADD CONSTRAINT "cat_butlerId_fkey" FOREIGN KEY ("butlerId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
