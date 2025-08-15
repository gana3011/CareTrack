/*
  Warnings:

  - The `clock_out` column on the `Shift` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `clock_in` on the `Shift` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
-- 1. Add temporary TIMESTAMP columns
ALTER TABLE "public"."Shift"
    ADD COLUMN "clock_in_tmp" TIMESTAMP(3),
    ADD COLUMN "clock_out_tmp" TIMESTAMP(3);

-- 2. Merge date + time into the new timestamp columns
UPDATE "public"."Shift"
SET clock_in_tmp  = "date"::timestamp + clock_in::time,
    clock_out_tmp = "date"::timestamp + clock_out::time;

-- 3. Drop old columns
ALTER TABLE "public"."Shift"
    DROP COLUMN "clock_in",
    DROP COLUMN "clock_out";

-- 4. Rename temp columns to the original names
ALTER TABLE "public"."Shift"
    RENAME COLUMN "clock_in_tmp" TO "clock_in";
ALTER TABLE "public"."Shift"
    RENAME COLUMN "clock_out_tmp" TO "clock_out";

-- 5. Enforce NOT NULL if needed
ALTER TABLE "public"."Shift"
    ALTER COLUMN "clock_in" SET NOT NULL;
