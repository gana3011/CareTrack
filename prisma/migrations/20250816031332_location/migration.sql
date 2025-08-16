/*
  Warnings:

  - Added the required column `clock_in_geofenceId` to the `Shift` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clock_in_location` to the `Shift` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clock_out_geofenceId` to the `Shift` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clock_out_location` to the `Shift` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `Shift` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Shift" ADD COLUMN     "clock_in_geofenceId" INTEGER,
ADD COLUMN     "clock_in_location" TEXT,
ADD COLUMN     "clock_out_geofenceId" INTEGER,
ADD COLUMN     "clock_out_location" TEXT,
ADD COLUMN     "location" TEXT;

UPDATE "public"."Shift" s
SET 
  "clock_in_geofenceId" = g.id,
  "clock_in_location" = g.name,
  "clock_out_geofenceId" = g.id,
  "clock_out_location" = g.name,
  "location" = g.name
FROM "public"."Geofence" g
WHERE g.id = 2;

-- AddForeignKey
ALTER TABLE "public"."Shift" ADD CONSTRAINT "Shift_clock_in_geofenceId_fkey" FOREIGN KEY ("clock_in_geofenceId") REFERENCES "public"."Geofence"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Shift" ADD CONSTRAINT "Shift_clock_out_geofenceId_fkey" FOREIGN KEY ("clock_out_geofenceId") REFERENCES "public"."Geofence"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "public"."Shift"
ALTER COLUMN "clock_in_geofenceId" SET NOT NULL,
ALTER COLUMN "clock_in_location" SET NOT NULL,
ALTER COLUMN "clock_out_geofenceId" SET NOT NULL,
ALTER COLUMN "clock_out_location" SET NOT NULL,
ALTER COLUMN "location" SET NOT NULL;