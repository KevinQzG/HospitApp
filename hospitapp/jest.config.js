// jest.config.js
const dotenv = require('dotenv');

// Load environment variables from .env.test
dotenv.config({ path: '.env.test' });

module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testTimeout: 30000,
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1', // Map @/ to src/
    },
    testMatch: ['**/tests/**/*.test.ts'], // Look for tests in the tests/ folder
    testPathIgnorePatterns: ['/node_modules/', '/.next/'],
};