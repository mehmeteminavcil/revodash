-- CreateTable
CREATE TABLE "start_message" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "message" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "start_message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "button" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "url" TEXT,
    "startId" INTEGER NOT NULL,

    CONSTRAINT "button_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "button" ADD CONSTRAINT "button_startId_fkey" FOREIGN KEY ("startId") REFERENCES "start_message"("id") ON DELETE CASCADE ON UPDATE CASCADE;
