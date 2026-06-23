export const todoData = {
  validTitles: {
    normal: 'Buy milk',
    minLength: 'A',
    maxLength: 'A'.repeat(199),

    emoji: '🔥 Important task',
    cyrillic: 'Купить молоко',
    specialChars: 'Task #1 @home',
  },

  invalidTitles: {
    empty: '',
    spaces: '   ',
    overMaxLength: 'A'.repeat(201), 
  },
};