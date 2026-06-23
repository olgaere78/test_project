import { test, expect } from '../../src/fixtures/fixtures';
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

test('user manages todo', async ({
    registeredUser,
    appApi,
}) => {
    const title = `Smoke todo ${Date.now()}`;

    const todo = await appApi.createTodo(
        registeredUser.token,
        title
    );

    const todos = await appApi.getTodos(registeredUser.token);

    expect(
        todos.some(t => t._id === todo._id)
    ).toBeTruthy();
});