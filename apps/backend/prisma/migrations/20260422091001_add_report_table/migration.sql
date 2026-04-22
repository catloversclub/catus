-- CreateTable
CREATE TABLE "report" (
    "post_id" TEXT NOT NULL,
    "reporter_id" TEXT NOT NULL,

    CONSTRAINT "report_pkey" PRIMARY KEY ("post_id","reporter_id")
);

-- AddForeignKey
ALTER TABLE "report" ADD CONSTRAINT "report_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report" ADD CONSTRAINT "report_reporter_id_fkey" FOREIGN KEY ("reporter_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
