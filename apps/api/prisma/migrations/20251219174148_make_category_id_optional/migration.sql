-- DropForeignKey
ALTER TABLE "feedbacks" DROP CONSTRAINT "feedbacks_category_id_fkey";

-- AlterTable
ALTER TABLE "feedbacks" ALTER COLUMN "category_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "feedbacks" ADD CONSTRAINT "feedbacks_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
