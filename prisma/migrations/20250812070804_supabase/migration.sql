/*
  Warnings:

  - You are about to drop the column `auth0_id` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."User_auth0_id_key";

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "auth0_id",
ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "picture" DROP NOT NULL;

-- CreateTable
CREATE TABLE "public"."Geofence" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "managerId" INTEGER NOT NULL,
    "center" geography(Point,4326) NOT NULL,
    "radius_meters" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Geofence_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_userId_key" ON "public"."User"("userId");

-- AddForeignKey
ALTER TABLE "public"."Geofence" ADD CONSTRAINT "Geofence_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
