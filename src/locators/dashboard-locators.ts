import { Page } from '@playwright/test';

export class DashboardLocators {
  constructor(private readonly page: Page) {}

  get todoHeading() {
    return this.page.getByRole('heading', { name: 'Todo' });
  }

  get todoInput() {
    return this.page.locator('[data-ui="todo-input"]');
  }

  get todosList() {
    return this.page.locator('[data-ui="todos-list"]');
  }

  get confirmDeleteTodoButton() {
    return this.page.locator('[data-ui="confirm-delete-todo-button"]');
  }

  todoItem(title: string) {
    return this.todosList.locator('li').filter({ hasText: title });
  }

  todoStatusCheckbox(title: string) {
    return this.todoItem(title).getByLabel('Переключить статус заметки');
  }

  deleteTodoButton(title: string) {
    return this.todoItem(title).getByLabel(`Удалить заметку ${title}`);
  }
}
