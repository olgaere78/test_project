

export const invalidLoginData = [
  {
    testCase: 'Empty email',
    email: '',
    password: 'Password123!',
    error: 'Please fill in this field.'
  },
  {
    testCase: 'Empty password',
    email: 'test@example.com',
    password: '',
    error: 'Please fill in this field.',
  },
  {
    testCase: 'Invalid email format',
    email: 'testexample.com',
    password: 'Password123!',
    error: "Please include an '@' in the email address. 'testexample.com' is missing an '@'.",
  },
//   {
//     testCase: 'Non-existing user',
//     email: 'notfound@example.com',
//     password: 'Password123!',
//     error: 'Invalid credentials',
//   },
  {
    testCase: 'Wrong password',
    email: 'test@example.com',
    password: 'WrongPassword123!',
    error: 'Invalid credentials',
  },
];