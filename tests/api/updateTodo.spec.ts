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

test.describe('Todo update API', () => {
  test('should update todo with valid values and reject invalid titles', async ({
    registeredUser,
    appApi,
  }) => {
    const validTodo = await appApi.createTodo(
      registeredUser.token,
      'Initial Todo'
    );

    createdTodoIds.push(validTodo._id);

    const validTitles = [
      todoData.validTitles.normal,
      todoData.validTitles.cyrillic,
    ];

    for (const title of validTitles) {
      const updatedTodo = await appApi.updateTodo(
        registeredUser.token,
        validTodo._id,
        title
      );

      expect(updatedTodo.title).toBe(title);
    }

    const todos = await appApi.getTodos(
      registeredUser.token
    );

    expect(
      todos.some(
        t =>
          t._id === validTodo._id &&
          t.title === validTitles[validTitles.length - 1]
      )
    ).toBeTruthy();

    const invalidTodo = await appApi.createTodo(
      registeredUser.token,
      'Initial Todo'
    );

    createdTodoIds.push(invalidTodo._id);

    for (const title of Object.values(todoData.invalidTitles)) {
      const response = await appApi.patchTodoRaw(
        registeredUser.token,
        invalidTodo._id,
        { title }
      );

      expect(response.status()).toBe(400);
    }
  });
});
