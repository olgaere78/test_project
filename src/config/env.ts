import fs from 'node:fs';
import path from 'node:path';

function loadDotEnv(): void {
  const filePath = path.resolve(__dirname, '../../.env');
  if (!fs.existsSync(filePath)) {
    return;
  }

  for (const line of fs.readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const separator = trimmed.indexOf('=');
    if (separator === -1) {
      continue;
    }

    const key = trimmed.slice(0, separator).trim();
    const rawValue = trimmed.slice(separator + 1).trim();
    if (!process.env[key]) {
      process.env[key] = rawValue.replace(/^['"]|['"]$/g, '');
    }
  }
}

loadDotEnv();

export const env = {
  baseUrl: process.env.BASE_URL ?? 'https://qa-a.recruitment.mediamarslab.com',
  accessKey: process.env.ACCESS_KEY ?? '',
  adminEmail: process.env.ADMIN_LOGIN ?? '',
  adminPassword: process.env.ADMIN_PASSWORD ?? '',
  analyticsBasicUser: process.env.ANALYTICS_BASIC_USER ?? 'QA_USER',
  analyticsBasicPassword: process.env.ANALYTICS_BASIC_PASSWORD ?? 'dtW,/aK8A6bk`3H?DZ',
};

export function requireAccessKey(): string {
  if (!env.accessKey) {
    throw new Error('ACCESS_KEY is required. Copy .env.example to .env and fill the key from vacancy-application.html.');
  }
  return env.accessKey;
}
