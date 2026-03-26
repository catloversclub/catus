CREATE TABLE "post_bookmark" (
    "post_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "post_bookmark_pkey" PRIMARY KEY ("post_id","user_id")
);

CREATE INDEX "post_bookmark_user_id_post_id_idx" ON "post_bookmark"("user_id", "post_id");

ALTER TABLE "post_bookmark" ADD CONSTRAINT "post_bookmark_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "post_bookmark" ADD CONSTRAINT "post_bookmark_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
