import { expect, Page } from '@playwright/test';
import { AuthLocators } from '../locators/auth-locators';
import { TestUser } from '../utils/test-data';

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
    await this.locators.registerNameInput.fill(user.name);
    await this.locators.registerEmailInput.fill(user.email);
    await this.locators.registerGenderSelect.selectOption(user.gender);
    await this.locators.registerPasswordInput.fill(user.password);
    await this.locators.registerAnalyticsConsentCheckbox.check();
    await this.locators.registerSubmitButton.click();
  }

  async login(email: string, password: string): Promise<void> {
    await this.locators.loginEmailInput.fill(email);
    await this.locators.loginPasswordInput.fill(password);
    await this.locators.loginSubmitButton.click();
  }
}
