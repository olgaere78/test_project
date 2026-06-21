import { Page } from '@playwright/test';

export class AdminLocators {
  constructor(private readonly page: Page) {}

  get loginHeading() {
    return this.page.getByRole('heading', { name: 'Вход администратора' });
  }

  get emailInput() {
    return this.page.locator('[data-ui="admin-email"]');
  }

  get passwordInput() {
    return this.page.locator('[data-ui="admin-password"]');
  }

  get loginButton() {
    return this.page.getByRole('button', { name: 'Войти' });
  }

  get panel() {
    return this.page.locator('[data-ui="admin-panel"]');
  }

  get userSearchInput() {
    return this.page.locator('[data-ui="admin-user-search"]');
  }

  get usersList() {
    return this.page.locator('[data-ui="admin-users"]');
  }
}
