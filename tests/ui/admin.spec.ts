import { test } from '../../src/fixtures/fixtures';
import { env } from '../../src/config/env';
import { makeTestUser } from '../../src/utils/test-data';

test.describe('Admin UI', () => {
  test.skip(!env.adminEmail || !env.adminPassword, 'ADMIN_LOGIN and ADMIN_PASSWORD are required for admin tests');

  test('admin can log in and find a registered user', async ({ unauthenticatedPage, appApi, app }) => {
    const user = makeTestUser();
    await appApi.createUserAndLogin(user);

    await app.adminPage.open();
    await app.adminPage.login(env.adminEmail, env.adminPassword);
    await app.adminPage.searchUser(user.email);
  });
});
