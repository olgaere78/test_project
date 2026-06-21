import { Page } from '@playwright/test';

export class AuthLocators {
  constructor(private readonly page: Page) {}

  get registerHeading() {
    return this.page.getByRole('heading', { name: 'Регистрация' });
  }

  get loginHeading() {
    return this.page.getByRole('heading', { name: 'Вход в систему' });
  }

  get registerNameInput() {
    return this.page.locator('[data-ui="register-name"]');
  }

  get registerEmailInput() {
    return this.page.locator('[data-ui="register-email"]');
  }

  get registerGenderSelect() {
    return this.page.locator('[data-ui="register-gender"]');
  }

  get registerPasswordInput() {
    return this.page.locator('[data-ui="register-password"]');
  }

  get registerAnalyticsConsentCheckbox() {
    return this.page.locator('[data-ui="register-analytics-consent"]');
  }

  get registerSubmitButton() {
    return this.page.getByRole('button', { name: 'Зарегистрироваться' });
  }

  get loginEmailInput() {
    return this.page.locator('[data-ui="login-email"]');
  }

  get loginPasswordInput() {
    return this.page.locator('[data-ui="login-password"]');
  }

  get loginSubmitButton() {
    return this.page.getByRole('button', { name: 'Войти' });
  }
}
