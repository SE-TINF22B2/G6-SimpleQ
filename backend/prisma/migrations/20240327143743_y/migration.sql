/*
  Warnings:

  - You are about to drop the column `tokenForPass` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `tokenForPass`,
    ADD COLUMN `hashedPassword` VARCHAR(191) NULL,
    ADD COLUMN `password` TEXT NULL;
