import { expect, Page } from '@playwright/test';
import { DashboardLocators } from '../locators/dashboard-locators';

export class DashboardPage {
  readonly locators: DashboardLocators;

  constructor(private readonly page: Page) {
    this.locators = new DashboardLocators(page);
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/dashboard\.html$/);
    await expect(this.locators.todoHeading).toBeVisible();
  }

  async createTodo(title: string): Promise<void> {
    await this.locators.todoInput.fill(title);
    const [response] = await Promise.all([
      this.page.waitForResponse((res) => res.url().includes('/api/todos') && res.request().method() === 'POST'),
      this.locators.todoInput.press('Enter'),
    ]);
    expect(response.ok(), await response.text()).toBeTruthy();
    await this.expectTodoVisible(title);
  }

  async expectTodoVisible(title: string): Promise<void> {
    await expect(this.locators.todosList).toContainText(title);
  }

  async completeTodo(title: string): Promise<void> {
    const item = this.locators.todoItem(title);
    await expect(item).toBeVisible();
    await this.locators.todoStatusCheckbox(title).check();
    await expect(item.getByText(title)).toHaveClass(/line-through/);
  }

  async deleteTodo(title: string): Promise<void> {
    const item = this.locators.todoItem(title);
    await expect(item).toBeVisible();
    await this.locators.deleteTodoButton(title).click();
    await this.locators.confirmDeleteTodoButton.click();
    await expect(item).toBeHidden();
  }
}
