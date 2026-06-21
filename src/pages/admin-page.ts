import { expect, Page } from '@playwright/test';
import { AdminLocators } from '../locators/admin-locators';

export class AdminPage {
  readonly locators: AdminLocators;

  constructor(private readonly page: Page) {
    this.locators = new AdminLocators(page);
  }

  async open(): Promise<void> {
    await this.page.goto('/admin.html');
    await expect(this.locators.loginHeading).toBeVisible();
  }

  async login(email: string, password: string): Promise<void> {
    await this.locators.emailInput.fill(email);
    await this.locators.passwordInput.fill(password);
    await this.locators.loginButton.click();
    await expect(this.locators.panel).toBeVisible();
  }

  async searchUser(email: string): Promise<void> {
    await this.locators.userSearchInput.fill(email);
    await expect(this.locators.usersList).toContainText(email);
  }
}
