/*
  Warnings:

  - You are about to drop the column `routeId` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `seatCount` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the `Route` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SeatAvailability` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Station` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `seatNumber` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('CONFIRMED', 'CANCELLED');

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_routeId_fkey";

-- DropForeignKey
ALTER TABLE "Route" DROP CONSTRAINT "Route_stationEndId_fkey";

-- DropForeignKey
ALTER TABLE "Route" DROP CONSTRAINT "Route_stationStartId_fkey";

-- DropForeignKey
ALTER TABLE "Route" DROP CONSTRAINT "Route_trainId_fkey";

-- DropForeignKey
ALTER TABLE "SeatAvailability" DROP CONSTRAINT "SeatAvailability_routeId_fkey";

-- DropForeignKey
ALTER TABLE "SeatAvailability" DROP CONSTRAINT "SeatAvailability_trainId_fkey";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "routeId",
DROP COLUMN "seatCount",
ADD COLUMN     "seatNumber" INTEGER NOT NULL,
ADD COLUMN     "status" "Status" NOT NULL;

-- AlterTable
ALTER TABLE "Train" ADD COLUMN     "availableSeats" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "destinationStation" TEXT NOT NULL DEFAULT 'unknown',
ADD COLUMN     "sourceStation" TEXT NOT NULL DEFAULT 'unknown';

-- DropTable
DROP TABLE "Route";

-- DropTable
DROP TABLE "SeatAvailability";

-- DropTable
DROP TABLE "Station";
