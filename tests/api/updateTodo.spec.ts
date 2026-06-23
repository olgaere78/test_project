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

const validTodos = Object.values(todoData.validTitles);
const invalidTodos = Object.values(todoData.invalidTitles);

for (const title of validTodos) {
  test(`should update todo with value: ${title}`, async ({
    registeredUser,
    appApi,
  }) => {
    const todo = await appApi.createTodo(
      registeredUser.token,
      'Initial Todo'
    );

    createdTodoIds.push(todo._id);

    const updatedTodo = await appApi.updateTodo(
      registeredUser.token,
      todo._id,
      title
    );

    expect(updatedTodo.title).toBe(title);

    const todos = await appApi.getTodos(
      registeredUser.token
    );

    expect(
      todos.some(
        t =>
          t._id === todo._id &&
          t.title === title
      )
    ).toBeTruthy();
  });
}

for (const title of invalidTodos) {
  test(`should not update todo with invalid value: ${title}`, async ({
    registeredUser,
    appApi,
  }) => {
    const todo = await appApi.createTodo(
      registeredUser.token,
      'Initial Todo'
    );

    createdTodoIds.push(todo._id);

    const response = await appApi.updateTodo(
      registeredUser.token,
      todo._id,
      title
    );

    expect(response.status()).toBe(400);
  });
}