/*
  Warnings:

  - The `status` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `invited_by` on the `workspace_invites` table. All the data in the column will be lost.
  - You are about to drop the `feedback_submissions` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `invited_by_user_id` to the `workspace_invites` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "feedback_submissions" DROP CONSTRAINT "feedback_submissions_feedback_id_fkey";

-- AlterTable
ALTER TABLE "feedbacks" ADD COLUMN     "customer_email" TEXT,
ADD COLUMN     "customer_id" TEXT,
ADD COLUMN     "customer_meta" JSONB,
ADD COLUMN     "customer_name" TEXT,
ALTER COLUMN "status" SET DEFAULT 'OPEN';

-- AlterTable
ALTER TABLE "users" DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'UNVERIFIED';

-- AlterTable
ALTER TABLE "workspace_invites" DROP COLUMN "invited_by",
ADD COLUMN     "invited_by_user_id" TEXT NOT NULL;

-- DropTable
DROP TABLE "feedback_submissions";

-- DropEnum
DROP TYPE "UserStatus";

-- CreateIndex
CREATE INDEX "feedbacks_project_id_idx" ON "feedbacks"("project_id");

-- CreateIndex
CREATE INDEX "feedbacks_category_id_idx" ON "feedbacks"("category_id");

-- CreateIndex
CREATE INDEX "feedbacks_status_idx" ON "feedbacks"("status");

-- AddForeignKey
ALTER TABLE "workspace_invites" ADD CONSTRAINT "workspace_invites_invited_by_user_id_fkey" FOREIGN KEY ("invited_by_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
