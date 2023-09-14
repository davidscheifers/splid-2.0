module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/test'],
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  moduleNameMapper: {
    '^@src/(.*)$': '<rootDir>/src/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@groups/(.*)$': '<rootDir>/src/groups/$1',
    '^@accounting/(.*)$': '<rootDir>/src/accounting/$1',
    '^@transactions/(.*)$': '<rootDir>/src/transactions/$1',
    '^@models/(.*)$': '<rootDir>/src/models/$1',
    '^@users/(.*)$': '<rootDir>/src/users/$1',
    '^@vpc/(.*)$': '<rootDir>/lib/vpc/$1',
    '^@rds/(.*)$': '<rootDir>/lib/rds/$1',
    '^@iam/(.*)$': '<rootDir>/lib/iam/$1',
    '^@api/(.*)$': '<rootDir>/lib/api/$1',
    '^@lib/(.*)$': '<rootDir>/lib/$1',
    '^@bin/(.*)$': '<rootDir>/bin/$1',
  }
};
