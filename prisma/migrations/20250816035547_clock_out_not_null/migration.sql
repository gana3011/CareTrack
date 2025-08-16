-- DropForeignKey
ALTER TABLE "public"."Shift" DROP CONSTRAINT "Shift_clock_out_geofenceId_fkey";

-- AlterTable
ALTER TABLE "public"."Shift" ALTER COLUMN "clock_out_geofenceId" DROP NOT NULL,
ALTER COLUMN "clock_out_location" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Shift" ADD CONSTRAINT "Shift_clock_out_geofenceId_fkey" FOREIGN KEY ("clock_out_geofenceId") REFERENCES "public"."Geofence"("id") ON DELETE SET NULL ON UPDATE CASCADE;
