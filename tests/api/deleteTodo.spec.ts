import { test, expect } from '../../src/fixtures/fixtures';

test('should delete todo', async ({
  registeredUser,
  appApi,
}) => {
  const todo = await appApi.createTodo(
    registeredUser.token,
    'Delete me'
  );

  await appApi.deleteTodo(
    registeredUser.token,
    todo._id
  );

  const todos = await appApi.getTodos(
    registeredUser.token
  );

  expect(
    todos.some(t => t._id === todo._id)
  ).toBeFalsy();
});