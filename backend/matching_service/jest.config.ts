import type { Config } from '@jest/types';
import { pathsToModuleNameMapper } from 'ts-jest';

import { compilerOptions } from './tsconfig.json';

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
    '^struct/(.*)$': '<rootDir>/src/struct/$1',
    '^types/(.*)$': '<rootDir>/src/types/$1',
    '^mockComponents/(.*)$': '<rootDir>/src/mockComponents/$1',
  },
};

export default config;
