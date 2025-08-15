/*
  Warnings:

  - A unique constraint covering the columns `[name,managerId]` on the table `Geofence` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Geofence_name_managerId_key" ON "public"."Geofence"("name", "managerId");
