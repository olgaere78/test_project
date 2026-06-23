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

  async updateProfile(name: string, consent: boolean, gender?: '0' | '1'): Promise<void> {
    await this.locators.nameInput.fill(name);
    if (gender === '0') {
      await this.locators.maleGenderRadio.check();
    }
    if (gender === '1') {
      await this.locators.femaleGenderRadio.check();
    }
    await this.locators.analyticsConsentCheckbox.setChecked(consent);
    await this.locators.submitButton.click();
  }

  async updateNameAndConsent(name: string, consent: boolean): Promise<void> {
    await this.updateProfile(name, consent);
  }

  async getNameValidationMessage(): Promise<string> {
    return this.locators.nameInput.evaluate(
      (el: HTMLInputElement) => el.validationMessage
    );
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

  async expectProfileData(name: string, email: string): Promise<void> {
    await expect(this.locators.nameInput).toHaveValue(name);
    await expect(this.locators.emailInput).toHaveValue(email);
  }

  async expectConsentCheckboxState(consent: boolean): Promise<void> {
    await expect(this.locators.analyticsConsentCheckbox).toHaveJSProperty('checked', consent);
  }

  async expectGender(gender: '0' | '1'): Promise<void> {
    await expect(gender === '0' ? this.locators.maleGenderRadio : this.locators.femaleGenderRadio).toBeChecked();
  }
}
