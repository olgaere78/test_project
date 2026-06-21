import { expect, Page } from '@playwright/test';
import { ProfileLocators } from '../locators/profile-locators';

export class ProfilePage {
  readonly locators: ProfileLocators;

  constructor(private readonly page: Page) {
    this.locators = new ProfileLocators(page);
  }

  async open(): Promise<void> {
    await this.page.goto('/profile.html');
    await expect(this.locators.profileHeading).toBeVisible();
  }

  async updateNameAndConsent(name: string, consent: boolean): Promise<void> {
    await this.locators.nameInput.fill(name);
    await this.locators.analyticsConsentCheckbox.setChecked(consent);
    await this.locators.submitButton.click();
  }

  async expectPasswordMismatchValidation(): Promise<void> {
    await this.locators.openPasswordModalButton.click();
    await this.locators.newPasswordInput.fill('Password-1');
    await this.locators.confirmPasswordInput.fill('Password-2');
    await this.locators.savePasswordButton.click();
    await expect(this.locators.passwordFormMessage).toHaveText('Пароли не совпадают');
    await this.locators.passwordModalCancelButton.click();
    await expect(this.locators.passwordModal).toBeHidden();
  }
}
