import { expect, Page } from '@playwright/test';
import { AuthLocators } from '../locators/auth-locators';
import { TestUser } from '../models/user-model';

export class AuthPage {
  readonly locators: AuthLocators;

  constructor(private readonly page: Page) {
    this.locators = new AuthLocators(page);
  }

  async openRegister(): Promise<void> {
    await this.page.goto('/register.html');
    await expect(this.locators.registerHeading).toBeVisible();
  }

  async openLogin(): Promise<void> {
    await this.page.goto('/index.html');
    await expect(this.locators.loginHeading).toBeVisible();
  }

  async register(user: TestUser): Promise<void> {
    await this.fillRegistrationForm(user);
    await this.locators.registerSubmitButton.click();
  }

  async fillRegistrationForm(user: TestUser): Promise<void> {
    await this.locators.registerNameInput.fill(user.name);
    await this.locators.registerEmailInput.fill(user.email);
    await this.locators.registerGenderSelect.selectOption(user.gender);
    await this.locators.registerPasswordInput.fill(user.password);
    await this.locators.registerAnalyticsConsentCheckbox.check();
  }

  async login(email: string, password: string): Promise<void> {
    await this.locators.loginEmailInput.fill(email);
    await this.locators.loginPasswordInput.fill(password);
    await this.locators.loginSubmitButton.click();
  }

  async getErrorMessage(): Promise<string> {
    return (await this.locators.errorMessage.textContent())?.trim() ?? '';
  }

  get loginButton() {
    return this.locators.loginSubmitButton;
  }

  async getValidationMessage(): Promise<string> {
    return this.locators.loginEmailInput.evaluate(
      (el: HTMLInputElement) => el.validationMessage
    );
  }

  async getRegisterEmailValidationMessage(): Promise<string> {
    return this.locators.registerEmailInput.evaluate(
      (el: HTMLInputElement) => el.validationMessage
    );
  }

  async getRegisterRequiredFieldValidationMessage(field: 'name' | 'email' | 'password'): Promise<string> {
    const input = {
      name: this.locators.registerNameInput,
      email: this.locators.registerEmailInput,
      password: this.locators.registerPasswordInput,
    }[field];

    return input.evaluate((el: HTMLInputElement) => el.validationMessage);
  }
}
