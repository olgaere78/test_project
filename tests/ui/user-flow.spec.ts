import { test, expect } from '../../src/fixtures/fixtures';

test.describe('User UI flow', () => {
  test('registers a user and manages a todo', async ({ appApi, app, authorizedPage , registeredUser,}) => {
    const title = `Smoke todo ${Date.now()}`;

    const todo = await appApi.createTodo(
        registeredUser.token,
        title
    );

    await authorizedPage.goto('/');
    await app.dashboardPage.expectLoaded();
    await app.dashboardPage.expectTodoVisible(title);
    await app.dashboardPage.completeTodo(title);
    await app.dashboardPage.deleteTodo(title);
  });

  test('updates profile consent and validates password mismatch client-side', async ({
    authorizedPage,
    registeredUser,
    app,
  }) => {
    await authorizedPage.goto('/');

    await app.profilePage.open();
    await expect(authorizedPage.locator('[data-ui="profile-email"]')).toHaveValue(registeredUser.user.email);

    await app.profilePage.expectPasswordMismatchValidation();
    await app.profilePage.updateNameAndConsent(`${registeredUser.user.name} Edited`, false);

    await expect(authorizedPage).toHaveURL(/\/dashboard\.html$/);
  });
});
