/*
  Warnings:

  - A unique constraint covering the columns `[project_id,name]` on the table `categories` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[workspace_id,name]` on the table `projects` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE INDEX "categories_project_id_idx" ON "categories"("project_id");

-- CreateIndex
CREATE UNIQUE INDEX "categories_project_id_name_key" ON "categories"("project_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "projects_workspace_id_name_key" ON "projects"("workspace_id", "name");
