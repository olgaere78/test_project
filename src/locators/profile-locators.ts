import { Page } from '@playwright/test';

export class ProfileLocators {
  constructor(private readonly page: Page) {}

  get profileHeading() {
    return this.page.getByRole('heading', { name: 'Профиль' });
  }

  get nameInput() {
    return this.page.locator('[data-ui="profile-name"]');
  }

  get emailInput() {
    return this.page.locator('[data-ui="profile-email"]');
  }

  get analyticsConsentCheckbox() {
    return this.page.locator('[data-ui="profile-analytics-consent"]');
  }

  get submitButton() {
    return this.page.locator('[data-ui="profile-submit"]');
  }

  get openPasswordModalButton() {
    return this.page.locator('[data-ui="profile-open-password-modal"]');
  }

  get newPasswordInput() {
    return this.page.locator('[data-ui="profile-new-password"]');
  }

  get confirmPasswordInput() {
    return this.page.locator('[data-ui="profile-confirm-password"]');
  }

  get savePasswordButton() {
    return this.page.getByRole('button', { name: 'Сохранить пароль' });
  }

  get passwordFormMessage() {
    return this.page.locator('[data-ui="password-form-message"]');
  }

  get passwordModalCancelButton() {
    return this.page.locator('[data-ui="password-modal-cancel"]');
  }

  get passwordModal() {
    return this.page.locator('[data-ui="password-modal"]');
  }
}
