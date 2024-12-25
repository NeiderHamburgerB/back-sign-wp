module.exports = {
  // ...otras propiedades

  moduleFileExtensions: ['ts', 'js', 'json'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  testEnvironment: 'node',

  // La parte clave: mapeo de alias
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
    // Si también tienes imports tipo 'modules/...'
     '^modules/(.*)$': '<rootDir>/src/modules/$1',
  },

  // Opcional pero recomendable para coverage
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
  ],
  coverageDirectory: '<rootDir>/coverage'
};
