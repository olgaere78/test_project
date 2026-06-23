import { test, expect } from '../../src/fixtures/fixtures';

test('Valid login', async ({
    app,
    unauthenticatedPage,
    registeredUser,
}) => {
    await unauthenticatedPage.goto('/');

    await app.authPage.login(registeredUser.user.email, registeredUser.user.password);
    await app.dashboardPage.expectLoaded();
    await app.profilePage.open();
    await app.profilePage.expectProfileData(registeredUser.user.name, registeredUser.user.email);
});


test('Should show validation message for empty email', async ({
  app,
  unauthenticatedPage,
}) => {
  await unauthenticatedPage.goto('/');

    await app.authPage.login(
    '',
    'Password123!'
  );

  expect(
    await app.authPage.getValidationMessage()
  ).toBeTruthy();
});

test('Should show validation message for invalid email', async ({
  app,
  unauthenticatedPage,
}) => {
  await unauthenticatedPage.goto('/');

  await app.authPage.login(
    'invalidemail',
    'Password123!'
  );

  expect(
    await app.authPage.getValidationMessage()
  ).toBeTruthy();
});

test('Should not login with wrong password', async ({
  app,
  unauthenticatedPage,
  registeredUser,
}) => {
  await unauthenticatedPage.goto('/');

  await app.authPage.login(
    registeredUser.user.email,
    'WrongPassword123!'
  );

  await expect(
    app.authPage.loginButton
  ).toBeVisible();
});

test('Should not login with non existing user', async ({
  app,
  unauthenticatedPage,
}) => {
  await unauthenticatedPage.goto('/');

  await app.authPage.login(
    'notfound@test.com',
    'Password123!'
  );

  await expect(
    app.authPage.loginButton
  ).toBeVisible();
});
