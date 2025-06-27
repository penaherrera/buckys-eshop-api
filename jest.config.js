// jest.config.js
export const moduleFileExtensions = ['js', 'json', 'ts'];
export const rootDir = 'src';
export const testRegex = '.*\\.spec\\.ts$';
export const transform = {
  '^.+\\.(t|j)s$': 'ts-jest',
};
export const collectCoverageFrom = ['**/*.(t|j)s'];
export const coverageDirectory = '../coverage';
export const testEnvironment = 'node';
export const moduleNameMapper = {
  '^@/(.*)$': '<rootDir>/$1',
};
export const testPathIgnorePatterns = [
  '/node_modules/',
  '/dist/',
  '\\.e2e-spec\\.ts$',
  '\\.controller\\.ts$',
  '\\.dto\\.ts$',
  '\\.entity\\.ts$',
  '\\.module\\.ts$',
  '\\.resolver\\.ts$',
  '\\.input\\.ts$',
  '\\.enum\\.ts$',
  '\\.strategy\\.ts$',
  '\\.filter\\.ts$',
  '\\.constants\\.ts$',
  '\\.config\\.ts$',
  '\\.type\\.ts$',
];
export const coveragePathIgnorePatterns = [
  '/node_modules/',
  '\\.module\\.ts$',
  '\\.controller\\.ts$',
  '\\.dto\\.ts$',
  '\\.entity\\.ts$',
  '\\.resolver\\.ts$',
  '\\.input\\.ts$',
  '\\.enum\\.ts$',
  '\\.strategy\\.ts$',
  '\\.filter\\.ts$',
  '\\.constants\\.ts$',
  '\\.type\\.ts$',
  '\\.config\\.ts$',
  'main.ts',
  'env.validation.ts',
  'dataloader.service.ts',
  'password-regex.ts',
  'cloudinary.provider.ts',
  'constants.ts',
  'sendgrid-client.ts',
  'get-user.decorator.ts',
  'passport-local.guard.ts',
];
