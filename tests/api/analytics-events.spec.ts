import path from 'node:path';
import { test, expect } from '../../src/fixtures/fixtures';
import { makeTestUser } from '../../src/utils/test-data';

type AnalyticsEvent = {
  type?: string;
  status?: 'success' | 'failed';
  timestamp?: string;
  email?: string;
  name?: string;
  gender?: '0' | '1';
  fileName?: string;
  reason?: string;
  analyticsConsent?: boolean;
};

const profilePhotoPath = path.resolve(__dirname, '../../src/data/files/profile-avatar.jpg');

async function waitForEvent(
  appApi: { getAnalyticsEvents: () => Promise<AnalyticsEvent[]> },
  predicate: (event: AnalyticsEvent) => boolean
) {
  let matched: AnalyticsEvent | undefined;

  await expect
    .poll(async () => {
      const events = await appApi.getAnalyticsEvents();
      matched = events.find(predicate);
      return Boolean(matched);
    }, { timeout: 15_000 })
    .toBe(true);

  return matched;
}

test.describe('Internal analytics API', () => {
  test('requires both X-Access-Key and Basic auth', async ({ appApi }) => {
    const withoutBasicAuth = await appApi.getAnalyticsEventsRaw();
    expect(withoutBasicAuth.status()).toBeGreaterThanOrEqual(400);

    const withoutAccessKey = await appApi.getAnalyticsEventsWithoutAccessKey();
    expect(withoutAccessKey.status()).toBeGreaterThanOrEqual(400);
  });

  test('records key user actions when internal analytics consent is enabled', async ({ appApi }, testInfo) => {
    const user = makeTestUser(testInfo.workerIndex);
    const newPassword = `${makeTestUser(testInfo.workerIndex).password}N`;
    const todoTitle = `Analytics todo ${Date.now()}`;
    const updatedTodoTitle = `${todoTitle} updated`;

    await appApi.register(user);
    const login = await appApi.login(user.email, user.password);
    const token = login.token;

    const todo = await appApi.createTodo(token, todoTitle);
    await appApi.patchTodo(token, todo._id, { completed: true });
    await appApi.updateTodo(token, todo._id, updatedTodoTitle);
    await appApi.deleteTodo(token, todo._id);
    await appApi.changePassword(token, 'Password-1', 'Password-2');
    await appApi.changePassword(token, newPassword);
    await appApi.uploadProfilePhoto(token, profilePhotoPath);
    await appApi.updateProfile(token, { name: user.name, gender: user.gender, internalAnalyticsConsent: false });
    await appApi.logout(token);

    const registerEvent = await waitForEvent(
      appApi,
      (event) => event.type === 'register' && event.email === user.email
    );
    expect(registerEvent).toMatchObject({
      status: 'success',
      email: user.email,
      name: user.name,
      gender: user.gender,
    });
    expect(registerEvent?.timestamp).toBeTruthy();

    await waitForEvent(appApi, (event) => event.type === 'login' && event.email === user.email && event.status === 'success');
    await waitForEvent(appApi, (event) => event.type === 'todoCreate' && event.email === user.email);
    await waitForEvent(appApi, (event) => event.type === 'todoComplete' && event.email === user.email);
    await waitForEvent(appApi, (event) => event.type === 'todoEdit' && event.email === user.email);
    await waitForEvent(appApi, (event) => event.type === 'todoDelete' && event.email === user.email);

    const passwordFailedEvent = await waitForEvent(
      appApi,
      (event) => event.type === 'passwordChangeFailed' && event.email === user.email
    );
    expect(passwordFailedEvent?.reason).toBeTruthy();

    await waitForEvent(
      appApi,
      (event) => event.type === 'passwordChangeSuccess' && event.email === user.email
    );

    const photoEvent = await waitForEvent(
      appApi,
      (event) => event.type === 'photoUpload' && event.email === user.email
    );
    expect(photoEvent?.fileName).toBe('profile-avatar.jpg');

    const consentEvent = await waitForEvent(
      appApi,
      (event) => event.type === 'analyticsConsentChange' && event.email === user.email
    );
    expect(consentEvent?.analyticsConsent).toBe(false);
  });
});
