module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleDirectories: ['node_modules', '<rootDir>/'],
    moduleFileExtensions: ['ts', 'js', 'json', 'node'],
    testMatch: ['<rootDir>/tests/**/*.test.ts'],
    transform: {
      '^.+\\.ts$': 'ts-jest',
    },
  };
  