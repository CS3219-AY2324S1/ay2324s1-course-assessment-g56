import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  moduleNameMapper: {
    '^controllers/(.*)$': '<rootDir>/src/controllers/$1',
    '^middleware/(.*)$': '<rootDir>/src/middleware/$1',
    '^routes/(.*)$': '<rootDir>/src/routes/$1',
    '^types/(.*)$': '<rootDir>/src/types/$1',
  },
};

export default config;
