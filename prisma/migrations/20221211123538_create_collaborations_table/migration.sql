-- CreateTable
CREATE TABLE "collaborations" (
    "id" UUID NOT NULL,
    "note_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,

    CONSTRAINT "collaborations_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "collaborations" ADD CONSTRAINT "collaborations_note_id_fkey" FOREIGN KEY ("note_id") REFERENCES "notes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collaborations" ADD CONSTRAINT "collaborations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
