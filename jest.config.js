/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

/** @type {import('jest').Config} */
const config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  coverageReporters: ['html'],
  collectCoverageFrom: ['src/**', '!src/**/*.d.ts'],
};

module.exports = config;
