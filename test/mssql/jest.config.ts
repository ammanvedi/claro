import {JestConfigWithTsJest} from "ts-jest";

const config: JestConfigWithTsJest = {
  rootDir: "./",
  preset: 'ts-jest',
  testEnvironment: 'node',
  displayName: 'MSSQL Tests',
  setupFilesAfterEnv: ['./jest.setup.ts']
};

module.exports = config