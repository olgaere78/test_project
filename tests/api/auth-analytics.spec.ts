import { test, expect } from '../../src/fixtures/fixtures';
import { requireAccessKey } from '../../src/config/env';
import { makeTestUser } from '../../src/utils/test-data';

test.describe('Auth and analytics API', () => {
  test('rejects protected auth request without X-Access-Key', async ({ request }) => {
    const user = makeTestUser();

    const response = await request.post('/api/auth/register', {
      data: {
        name: user.name,
        email: user.email,
        gender: user.gender,
        password: user.password,
        internalAnalyticsConsent: true,
      },
    });

    expect(response.ok()).toBeFalsy();
    await expect(response).not.toBeOK();
    await expect(response.json()).resolves.toMatchObject({
      message: expect.stringContaining('X-Access-Key'),
    });
  });

  test('registers, logs in and returns user profile by bearer token', async ({ appApi }) => {
    const user = makeTestUser();
    const token = await appApi.createUserAndLogin(user);

    const profile = await appApi.getProfile(token);

    expect(profile.user).toMatchObject({
      name: user.name,
      email: user.email,
      gender: user.gender,
      internalAnalyticsConsent: true,
    });
  });

  test('returns recent internal analytics events with access key and Basic auth', async ({ appApi }) => {
    requireAccessKey();
    const user = makeTestUser();
    await appApi.createUserAndLogin(user);

    await expect
      .poll(async () => {
        const events = await appApi.getAnalyticsEvents();
        return events.some((event: { type?: string; email?: string }) => event.type === 'register' && event.email === user.email);
      })
      .toBe(true);
  });
});
