import { test, expect } from '../../src/fixtures/fixtures';
import { todoData } from '../../src/data/todoData'; 

let createdTodoIds: string[] = [];

test.afterEach(async ({ appApi, registeredUser }) => {
  for (const todoId of createdTodoIds) {
    await appApi.deleteTodo(
      registeredUser.token,
      todoId
    );
  }

  createdTodoIds = [];
});

test.describe('Todo create API', () => {
  test('should create todos with representative valid values', async ({
    registeredUser,
    appApi,
  }) => {
    const validTitles = [
      todoData.validTitles.normal,
      todoData.validTitles.cyrillic,
    ];

    for (const title of validTitles) {
      const todo = await appApi.createTodo(
        registeredUser.token,
        title
      );

      createdTodoIds.push(todo._id);

      expect(todo.title).toBe(title);
    }

    const todos = await appApi.getTodos(
      registeredUser.token
    );

    for (const todoId of createdTodoIds) {
      expect(
        todos.some(t => t._id === todoId)
      ).toBeTruthy();
    }
  });

  test('should reject invalid todo titles', async ({
    registeredUser,
    appApi,
  }) => {
    for (const title of Object.values(todoData.invalidTitles)) {
      const response = await appApi.createTodoRaw(
        registeredUser.token,
        title
      );

      expect(response.status()).toBe(400);
    }
  });
});
