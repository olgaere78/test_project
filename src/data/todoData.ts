export const todoData = {
  valid: {
    normal: 'Buy milk',
    minLength: 'A',
    maxLength: 'A'.repeat(255),

    emoji: '🔥 Important task',
    cyrillic: 'Купить молоко',
    specialChars: 'Task #1 @home',
  },

  invalid: {
    empty: '',
    spaces: '   ',
    overMaxLength: 'A'.repeat(256), 
  },
};