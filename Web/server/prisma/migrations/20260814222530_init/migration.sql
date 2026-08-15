-- CreateTable
CREATE TABLE "FranchiseLead" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "phone" TEXT,
    "message" TEXT,
    "status" TEXT NOT NULL DEFAULT 'new',
    "notes" TEXT,
    "consentPrivacy" BOOLEAN NOT NULL DEFAULT false,
    "consentAt" DATETIME,
    "privacyVersion" TEXT,
    "ipHash" TEXT,
    "userAgent" TEXT,
    "retentionUntil" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "JobApplication" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "role" TEXT,
    "message" TEXT,
    "personality" TEXT,
    "cvStoredName" TEXT,
    "cvOriginalName" TEXT,
    "cvMimeType" TEXT,
    "cvSizeBytes" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'new',
    "notes" TEXT,
    "consentPrivacy" BOOLEAN NOT NULL DEFAULT false,
    "consentAt" DATETIME,
    "privacyVersion" TEXT,
    "ipHash" TEXT,
    "userAgent" TEXT,
    "retentionUntil" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CookieConsent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "visitorId" TEXT NOT NULL,
    "necessary" BOOLEAN NOT NULL DEFAULT true,
    "functional" BOOLEAN NOT NULL DEFAULT false,
    "analytics" BOOLEAN NOT NULL DEFAULT false,
    "action" TEXT NOT NULL,
    "policyVersion" TEXT NOT NULL,
    "ipHash" TEXT,
    "userAgent" TEXT,
    "retentionUntil" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT,
    "role" TEXT NOT NULL DEFAULT 'admin',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLoginAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "actorId" TEXT,
    "actorEmail" TEXT,
    "action" TEXT NOT NULL,
    "entity" TEXT,
    "entityId" TEXT,
    "detail" TEXT,
    "ipHash" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "FranchiseLead_status_idx" ON "FranchiseLead"("status");

-- CreateIndex
CREATE INDEX "FranchiseLead_createdAt_idx" ON "FranchiseLead"("createdAt");

-- CreateIndex
CREATE INDEX "FranchiseLead_retentionUntil_idx" ON "FranchiseLead"("retentionUntil");

-- CreateIndex
CREATE INDEX "JobApplication_status_idx" ON "JobApplication"("status");

-- CreateIndex
CREATE INDEX "JobApplication_createdAt_idx" ON "JobApplication"("createdAt");

-- CreateIndex
CREATE INDEX "JobApplication_retentionUntil_idx" ON "JobApplication"("retentionUntil");

-- CreateIndex
CREATE INDEX "CookieConsent_visitorId_idx" ON "CookieConsent"("visitorId");

-- CreateIndex
CREATE INDEX "CookieConsent_createdAt_idx" ON "CookieConsent"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");
