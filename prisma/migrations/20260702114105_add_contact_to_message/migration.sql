/*
  Warnings:

  - Added the required column `contactEmail` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contactPhone` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `message` ADD COLUMN `contactEmail` VARCHAR(191) NOT NULL,
    ADD COLUMN `contactPhone` VARCHAR(191) NOT NULL;
