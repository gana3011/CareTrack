/*
  Warnings:

  - You are about to drop the column `userId` on the `Shift` table. All the data in the column will be lost.
  - Added the required column `date` to the `Shift` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workerId` to the `Shift` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Shift" DROP CONSTRAINT "Shift_userId_fkey";

-- AlterTable
ALTER TABLE "public"."Shift" DROP COLUMN "userId",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "workerId" INTEGER NOT NULL,
ALTER COLUMN "clock_out" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Shift_workerId_idx" ON "public"."Shift"("workerId");

-- AddForeignKey
ALTER TABLE "public"."Shift" ADD CONSTRAINT "Shift_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
