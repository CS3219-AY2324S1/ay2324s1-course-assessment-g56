import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  testMatch: ['**/*.test.ts'],
  moduleNameMapper: {
    '^constants/(.*)$': '<rootDir>/src/constants/$1',
    '^socket/(.*)$': '<rootDir>/src/socket/$1',
    '^structs/(.*)$': '<rootDir>/src/structs/$1',
    '^types/(.*)$': '<rootDir>/src/types/$1',
    '^mockComponents/(.*)$': '<rootDir>/src/mockComponents/$1',
  },
};

export default config;
