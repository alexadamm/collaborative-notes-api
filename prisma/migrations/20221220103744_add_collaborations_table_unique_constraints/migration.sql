/*
  Warnings:

  - A unique constraint covering the columns `[note_id,user_id]` on the table `collaborations` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "collaborations_note_id_user_id_key" ON "collaborations"("note_id", "user_id");
