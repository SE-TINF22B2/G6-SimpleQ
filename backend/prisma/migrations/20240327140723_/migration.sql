/*
  Warnings:

  - You are about to drop the column `providerAccountId` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `providerAccountId`,
    ADD COLUMN `tokenForPass` TEXT NULL;
