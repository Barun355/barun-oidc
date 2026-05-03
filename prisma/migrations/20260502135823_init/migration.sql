-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "firstName" VARCHAR(50) NOT NULL,
    "lastName" VARCHAR(50) NOT NULL,
    "email" VARCHAR(256) NOT NULL,
    "dateOfBirth" TIMESTAMP(3),
    "gender" TEXT,
    "password" TEXT NOT NULL,
    "avatarUrl" TEXT DEFAULT 'https://ik.imagekit.io/lespresources/auth-service-avatars/default-avtar-1233321123321123321.jpg?updatedAt=1776092643846',
    "passwordResetToken" TEXT,
    "emailVerificationToken" TEXT,
    "passwordResetTokenExpiresAt" TIMESTAMP(3),
    "emailVerificationTokenExpiresAt" TIMESTAMP(3),
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clients" (
    "id" TEXT NOT NULL,
    "applicationName" VARCHAR(50) NOT NULL,
    "applicationDescription" VARCHAR(200) NOT NULL,
    "redirectUrl" TEXT NOT NULL,
    "applicationUrl" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "clientSecret" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userCodes" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "refreshToken" TEXT,
    "authorizationCode" TEXT,
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "authorizationCodeExpiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "userCodes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "clients_applicationName_key" ON "clients"("applicationName");

-- CreateIndex
CREATE UNIQUE INDEX "clients_redirectUrl_key" ON "clients"("redirectUrl");

-- CreateIndex
CREATE UNIQUE INDEX "clients_applicationUrl_key" ON "clients"("applicationUrl");

-- CreateIndex
CREATE UNIQUE INDEX "clients_clientId_key" ON "clients"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "clients_clientSecret_key" ON "clients"("clientSecret");

-- AddForeignKey
ALTER TABLE "userCodes" ADD CONSTRAINT "userCodes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userCodes" ADD CONSTRAINT "userCodes_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;
