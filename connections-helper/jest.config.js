module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jest-environment-jsdom',
    testMatch: ['**/tests/**/*.test.ts'],
    moduleNameMapper: {
        "^(\\.{1,2}/.*)\\.js$": "$1"
    }
};