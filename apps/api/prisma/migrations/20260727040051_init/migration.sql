/*
  Warnings:

  - You are about to drop the column `customer_email` on the `feedbacks` table. All the data in the column will be lost.
  - You are about to drop the column `customer_id` on the `feedbacks` table. All the data in the column will be lost.
  - You are about to drop the column `customer_meta` on the `feedbacks` table. All the data in the column will be lost.
  - You are about to drop the column `customer_name` on the `feedbacks` table. All the data in the column will be lost.
  - You are about to drop the column `project_id` on the `feedbacks` table. All the data in the column will be lost.
  - You are about to drop the column `project_id` on the `labels` table. All the data in the column will be lost.
  - You are about to drop the `api_keys` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `projects` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[workspace_id,slug]` on the table `labels` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `workspaces` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `author_id` to the `feedbacks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workspace_id` to the `feedbacks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workspace_id` to the `labels` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `workspaces` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "api_keys" DROP CONSTRAINT "api_keys_project_id_fkey";

-- DropForeignKey
ALTER TABLE "feedbacks" DROP CONSTRAINT "feedbacks_project_id_fkey";

-- DropForeignKey
ALTER TABLE "labels" DROP CONSTRAINT "labels_project_id_fkey";

-- DropForeignKey
ALTER TABLE "projects" DROP CONSTRAINT "projects_workspace_id_fkey";

-- DropIndex
DROP INDEX "feedbacks_project_id_idx";

-- DropIndex
DROP INDEX "feedbacks_status_idx";

-- DropIndex
DROP INDEX "labels_project_id_idx";

-- DropIndex
DROP INDEX "labels_project_id_slug_key";

-- AlterTable
ALTER TABLE "feedbacks" DROP COLUMN "customer_email",
DROP COLUMN "customer_id",
DROP COLUMN "customer_meta",
DROP COLUMN "customer_name",
DROP COLUMN "project_id",
ADD COLUMN     "author_id" TEXT NOT NULL,
ADD COLUMN     "merged_into_id" TEXT,
ADD COLUMN     "status_changed_at" TIMESTAMP(3),
ADD COLUMN     "vote_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "workspace_id" TEXT NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "labels" DROP COLUMN "project_id",
ADD COLUMN     "workspace_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "mfa_enabled" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "workspaces" ADD COLUMN     "slug" TEXT NOT NULL;

-- DropTable
DROP TABLE "api_keys";

-- DropTable
DROP TABLE "projects";

-- CreateTable
CREATE TABLE "attachments" (
    "id" TEXT NOT NULL,
    "feedback_id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "storage_key" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "size_bytes" INTEGER NOT NULL,
    "uploaded_by_user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comments" (
    "id" TEXT NOT NULL,
    "feedback_id" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "parent_id" TEXT,
    "is_internal" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mfa_methods" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'TOTP',
    "secret_encrypted" TEXT,
    "confirmed_at" TIMESTAMP(3),
    "last_used_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mfa_methods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mfa_recovery_codes" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "code_hash" TEXT NOT NULL,
    "used_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mfa_recovery_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "votes" (
    "id" TEXT NOT NULL,
    "feedback_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "votes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workspace_customers" (
    "id" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workspace_customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workspace_settings" (
    "id" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,
    "board_visibility" TEXT NOT NULL DEFAULT 'PUBLIC',
    "roadmap_public" BOOLEAN NOT NULL DEFAULT true,
    "roadmap_statuses" TEXT[] DEFAULT ARRAY['PLANNED', 'IN_PROGRESS', 'COMPLETED']::TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workspace_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "attachments_feedback_id_idx" ON "attachments"("feedback_id");

-- CreateIndex
CREATE INDEX "comments_feedback_id_idx" ON "comments"("feedback_id");

-- CreateIndex
CREATE INDEX "mfa_methods_user_id_idx" ON "mfa_methods"("user_id");

-- CreateIndex
CREATE INDEX "mfa_recovery_codes_user_id_idx" ON "mfa_recovery_codes"("user_id");

-- CreateIndex
CREATE INDEX "votes_feedback_id_idx" ON "votes"("feedback_id");

-- CreateIndex
CREATE UNIQUE INDEX "votes_feedback_id_user_id_key" ON "votes"("feedback_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "workspace_customers_workspace_id_user_id_key" ON "workspace_customers"("workspace_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "workspace_settings_workspace_id_key" ON "workspace_settings"("workspace_id");

-- CreateIndex
CREATE INDEX "feedbacks_workspace_id_idx" ON "feedbacks"("workspace_id");

-- CreateIndex
CREATE INDEX "feedbacks_workspace_id_status_idx" ON "feedbacks"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "feedbacks_status_changed_at_idx" ON "feedbacks"("status_changed_at");

-- CreateIndex
CREATE INDEX "feedbacks_merged_into_id_idx" ON "feedbacks"("merged_into_id");

-- CreateIndex
CREATE INDEX "labels_workspace_id_idx" ON "labels"("workspace_id");

-- CreateIndex
CREATE UNIQUE INDEX "labels_workspace_id_slug_key" ON "labels"("workspace_id", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "workspaces_slug_key" ON "workspaces"("slug");

-- AddForeignKey
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_feedback_id_fkey" FOREIGN KEY ("feedback_id") REFERENCES "feedbacks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_uploaded_by_user_id_fkey" FOREIGN KEY ("uploaded_by_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_feedback_id_fkey" FOREIGN KEY ("feedback_id") REFERENCES "feedbacks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "comments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedbacks" ADD CONSTRAINT "feedbacks_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedbacks" ADD CONSTRAINT "feedbacks_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedbacks" ADD CONSTRAINT "feedbacks_merged_into_id_fkey" FOREIGN KEY ("merged_into_id") REFERENCES "feedbacks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "labels" ADD CONSTRAINT "labels_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mfa_methods" ADD CONSTRAINT "mfa_methods_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mfa_recovery_codes" ADD CONSTRAINT "mfa_recovery_codes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "votes" ADD CONSTRAINT "votes_feedback_id_fkey" FOREIGN KEY ("feedback_id") REFERENCES "feedbacks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "votes" ADD CONSTRAINT "votes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspace_customers" ADD CONSTRAINT "workspace_customers_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspace_customers" ADD CONSTRAINT "workspace_customers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspace_settings" ADD CONSTRAINT "workspace_settings_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;
