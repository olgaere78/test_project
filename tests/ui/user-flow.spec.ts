import { test, expect } from '../../src/fixtures/fixtures';
import { makeTestUser } from '../../src/utils/test-data';

test.describe('User UI flow', () => {
  test('registers a user and manages a todo', async ({ appApi, app, authPage , registeredUser,}) => {
    const title = `Smoke todo ${Date.now()}`;

    const todo = await appApi.createTodo(
        registeredUser.token,
        title
    );

    await authPage.goto('/');
    await app.dashboardPage.expectLoaded();
    await app.dashboardPage.expectTodoVisible(title);
    await app.dashboardPage.completeTodo(title);
    await app.dashboardPage.deleteTodo(title);
  });

  test('updates profile consent and validates password mismatch client-side', async ({ page, appApi, app }) => {
    const user = makeTestUser();
    const token = await appApi.createUserAndLogin(user);
    await page.goto('/');
    await page.evaluate((value) => localStorage.setItem('token', value), token);

    await app.profilePage.open();
    await expect(page.locator('[data-ui="profile-email"]')).toHaveValue(user.email);

    await app.profilePage.expectPasswordMismatchValidation();
    await app.profilePage.updateNameAndConsent(`${user.name} Edited`, false);

    await expect(page).toHaveURL(/\/dashboard\.html$/);
  });
});
