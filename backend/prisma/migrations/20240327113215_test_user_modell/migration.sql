/*
  Warnings:

  - You are about to drop the column `authVariant` on the `User` table. All the data in the column will be lost.
  - Added the required column `provider` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `authVariant`,
    ADD COLUMN `provider` VARCHAR(191) NOT NULL;
