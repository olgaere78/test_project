import path from 'node:path';
import { expect, test } from '../../src/fixtures/fixtures';
import { makeTestUser } from '../../src/utils/test-data';

const profilePhotoPath = path.resolve(__dirname, '../../src/data/files/profile-avatar.jpg');

test.describe('Profile UI', () => {
  test('shows registered user profile data', async ({ app, authorizedPage, registeredUser }) => {
    await authorizedPage.goto('/profile.html');

    await app.profilePage.expectProfileData(registeredUser.user.name, registeredUser.user.email);
    await app.profilePage.expectGender(registeredUser.user.gender);
    await app.profilePage.expectConsentCheckboxState(true);
    await expect(app.profilePage.locators.emailInput).toHaveJSProperty('readOnly', true);
    await expect(app.profilePage.locators.avatarImage).toHaveAttribute('src', /^data:image\/svg\+xml/);
    await expect(app.profilePage.locators.removePhotoButton).toBeHidden();
  });

  test('updates gender and analytics consent', async ({ app, appApi, authorizedPage, registeredUser }) => {
    const updatedGender = registeredUser.user.gender === '0' ? '1' : '0';

    await authorizedPage.goto('/profile.html');
    await app.profilePage.updateProfile(registeredUser.user.name, false, updatedGender);

    await expect(authorizedPage).toHaveURL(/\/dashboard\.html$/);

    const profile = await appApi.getProfile(registeredUser.token);
    expect(profile.user).toMatchObject({
      name: registeredUser.user.name,
      email: registeredUser.user.email,
      gender: updatedGender,
      internalAnalyticsConsent: false,
    });
  });

  test('redirects unauthenticated user to login page', async ({ unauthenticatedPage }) => {
    await unauthenticatedPage.goto('/profile.html');

    await expect(unauthenticatedPage).toHaveURL(/\/index\.html$/);
  });

  test('validates password mismatch in modal', async ({ app, authorizedPage }) => {
    await authorizedPage.goto('/profile.html');

    await app.profilePage.expectPasswordMismatchValidation();
  });

  test('uploads profile photo as avatar', async ({ app, authorizedPage }) => {
    await authorizedPage.goto('/profile.html');

    await app.profilePage.locators.photoInput.setInputFiles(profilePhotoPath);

    await expect(app.profilePage.locators.avatarImage).not.toHaveAttribute('src', /^data:image\/svg\+xml/);
    await expect(app.profilePage.locators.removePhotoButton).toBeVisible();
  });

  test('changes password and allows login with new password', async ({ app, appApi, authorizedPage, registeredUser }) => {
    const newPassword = `${makeTestUser().password}P`;

    await authorizedPage.goto('/profile.html');
    await app.profilePage.locators.openPasswordModalButton.click();
    await app.profilePage.locators.newPasswordInput.fill(newPassword);
    await app.profilePage.locators.confirmPasswordInput.fill(newPassword);
    await app.profilePage.locators.savePasswordButton.click();

    await expect(app.profilePage.locators.passwordModal).toBeHidden();
    const login = await appApi.login(registeredUser.user.email, newPassword);
    expect(login.token).toBeTruthy();
  });
});
