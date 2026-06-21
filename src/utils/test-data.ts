export type TestUser = {
  name: string;
  email: string;
  password: string;
  gender: '0' | '1';
};

export function makeTestUser(workerIndex = 0): TestUser {
  const stamp = `${Date.now()}-${workerIndex}-${Math.random().toString(16).slice(2, 8)}`;
  return {
    name: `QA User ${stamp}`,
    email: `qa-user-${stamp}@example.test`,
    password: `QAPass-${stamp}!`,
    gender: '0',
  };
}
