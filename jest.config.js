export default {
  testEnvironment: 'jsdom',
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  transform: {
    '^.+\\.js$': ['ts-jest', {
      diagnostics: {
        ignoreCodes: [151002]
      }
    }],
  },
  moduleFileExtensions: ['js', 'ts', 'json'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  testPathIgnorePatterns: ['/node_modules/', '/.meteor/'],
};
