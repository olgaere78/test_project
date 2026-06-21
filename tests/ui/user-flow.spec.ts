import { test, expect } from '../../src/fixtures/fixtures';
import { ProfilePage } from '../../src/pages/profile-page';
import { makeTestUser } from '../../src/utils/test-data';

test.describe('User UI flow', () => {
  test('registers a user and manages a todo', async ({ page, appApi, app }) => {
    const user = makeTestUser();
    const title = `Smoke todo ${Date.now()}`;

    await app.authPage.openRegister();
    await app.authPage.register(user);
    await app.dashboardPage.expectLoaded();

    const token = await page.evaluate(() => localStorage.getItem('token'));
    if (!token) {
      throw new Error('User token was not stored after registration');
    }
    await appApi.createTodo(token, title);
    await page.reload();
    await app.dashboardPage.expectTodoVisible(title);
    await app.dashboardPage.completeTodo(title);
    await app.dashboardPage.deleteTodo(title);
  });

  test('updates profile consent and validates password mismatch client-side', async ({ page, appApi }) => {
    const user = makeTestUser();
    const token = await appApi.createUserAndLogin(user);
    await page.goto('/');
    await page.evaluate((value) => localStorage.setItem('token', value), token);

    const profile = new ProfilePage(page);
    await profile.open();
    await expect(page.locator('[data-ui="profile-email"]')).toHaveValue(user.email);

    await profile.expectPasswordMismatchValidation();
    await profile.updateNameAndConsent(`${user.name} Edited`, false);

    await expect(page).toHaveURL(/\/dashboard\.html$/);
  });
});
