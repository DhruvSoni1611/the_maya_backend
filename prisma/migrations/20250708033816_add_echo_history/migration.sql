-- CreateTable
CREATE TABLE "EchoHistory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "promptTitle" TEXT NOT NULL,
    "outputUrl" TEXT NOT NULL,
    "voiceUsed" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EchoHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EchoHistory_userId_idx" ON "EchoHistory"("userId");

-- AddForeignKey
ALTER TABLE "EchoHistory" ADD CONSTRAINT "EchoHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
