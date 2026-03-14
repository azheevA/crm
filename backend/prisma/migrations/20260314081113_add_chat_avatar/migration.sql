/*
  Warnings:

  - A unique constraint covering the columns `[avatarId]` on the table `Chat` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[chatId]` on the table `Photo` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Chat" ADD COLUMN     "avatarId" INTEGER;

-- AlterTable
ALTER TABLE "Photo" ADD COLUMN     "chatId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Chat_avatarId_key" ON "Chat"("avatarId");

-- CreateIndex
CREATE UNIQUE INDEX "Photo_chatId_key" ON "Photo"("chatId");

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_avatarId_fkey" FOREIGN KEY ("avatarId") REFERENCES "Photo"("id") ON DELETE SET NULL ON UPDATE CASCADE;
