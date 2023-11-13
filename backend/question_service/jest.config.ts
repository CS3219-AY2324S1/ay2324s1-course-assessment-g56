import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  moduleNameMapper: {
    '^controllers/(.*)$': '<rootDir>/controllers/$1',
    '^middleware/(.*)$': '<rootDir>/middleware/$1',
    '^routes/(.*)$': '<rootDir>/routes/$1',
    '^types/(.*)$': '<rootDir>/types/$1',
  },
};

export default config;
