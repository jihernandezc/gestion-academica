module.exports = {
    setupFilesAfterEnv: ['<rootDir>/src/prisma/prisma.test.setup.ts'],
    testEnvironment: 'node', // Asegura que Jest use Node en lugar de un navegador
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: '.',
    testRegex: '.*\\.spec\\.ts$', // Asegura que solo los archivos de prueba se ejecuten
    transform: {
      '^.+\\.(t|j)s$': 'ts-jest',
    },
  };
  