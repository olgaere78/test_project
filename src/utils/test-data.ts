import { TestUser } from '../models/user-model';

export function makeTestUser(workerIndex = 0, overrides: Partial<TestUser> = {}): TestUser {
  const stamp = uniqueStamp(workerIndex);
  return {
    name: `QA User ${stamp}`,
    email: `qa-user-${stamp}@example.test`,
    password: `QAPass-${stamp}!`,
    gender: '0',
    ...overrides,
  };
}

export function uniqueStamp(workerIndex = 0): string {
  return `${Date.now()}-${workerIndex}-${Math.random().toString(16).slice(2, 8)}`;
}
