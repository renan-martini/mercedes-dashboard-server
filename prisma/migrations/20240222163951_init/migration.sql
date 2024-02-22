/*
  Warnings:

  - A unique constraint covering the columns `[code,projectId]` on the table `Baumster` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Baumster_code_projectId_key" ON "Baumster"("code", "projectId");
