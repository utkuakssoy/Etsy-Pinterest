import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import type { EtsyListingView } from "@/types";

export type ImportedEtsyShop = {
  shop: {
    id: string;
    etsyShopId: string;
    name: string;
    url: string;
  };
  listings: EtsyListingView[];
  importedAt: string;
};

export type PinterestAuth = {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: string;
  scope?: string;
  connectedAt: string;
};

export type PinterestAppCredentials = {
  clientId: string;
  clientSecret: string;
  savedAt: string;
};

const dataDir = path.join(process.cwd(), "data");
const etsyImportPath = path.join(dataDir, "etsy-import.json");
const pinterestAuthPath = path.join(dataDir, "pinterest-auth.json");
const pinterestCredentialsPath = path.join(dataDir, "pinterest-credentials.json");

export function readImportedEtsyShop(): ImportedEtsyShop | null {
  if (!existsSync(etsyImportPath)) {
    return null;
  }

  try {
    return JSON.parse(readFileSync(etsyImportPath, "utf8")) as ImportedEtsyShop;
  } catch {
    return null;
  }
}

export function saveImportedEtsyShop(importedShop: ImportedEtsyShop) {
  if (!existsSync(dataDir)) {
    mkdirSync(dataDir, { recursive: true });
  }

  writeFileSync(etsyImportPath, JSON.stringify(importedShop, null, 2), "utf8");
}

export function readPinterestAuth(): PinterestAuth | null {
  if (!existsSync(pinterestAuthPath)) {
    return null;
  }

  try {
    return JSON.parse(readFileSync(pinterestAuthPath, "utf8")) as PinterestAuth;
  } catch {
    return null;
  }
}

export function savePinterestAuth(auth: PinterestAuth) {
  if (!existsSync(dataDir)) {
    mkdirSync(dataDir, { recursive: true });
  }

  writeFileSync(pinterestAuthPath, JSON.stringify(auth, null, 2), "utf8");
}

export function readPinterestAppCredentials(): PinterestAppCredentials | null {
  if (!existsSync(pinterestCredentialsPath)) {
    return null;
  }

  try {
    return JSON.parse(readFileSync(pinterestCredentialsPath, "utf8")) as PinterestAppCredentials;
  } catch {
    return null;
  }
}

export function savePinterestAppCredentials(credentials: Omit<PinterestAppCredentials, "savedAt">) {
  if (!existsSync(dataDir)) {
    mkdirSync(dataDir, { recursive: true });
  }

  writeFileSync(
    pinterestCredentialsPath,
    JSON.stringify({ ...credentials, savedAt: new Date().toISOString() }, null, 2),
    "utf8"
  );
}
