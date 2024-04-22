import type { Config } from './config.interface';

const config: Config = {
  nest: {
    port: 3000,
  },
  cors: {
    enabled: true,
  },
  swagger: {
    enabled: true,
    title: 'Nestjs FTW',
    description: 'The nestjs API description',
    version: '1.5',
    path: 'api',
  },
  graphql: {
    playgroundEnabled: true,
    debug: true,
    schemaDestination: './src/schema.graphql',
    sortSchema: true,
  },
  security: {
    expiresIn: '200m',
    refreshIn: '7d',
    bcryptSaltOrRound: 10,
    defaultPassword: '73b4894b-edb4-4c08-8a4e-084896cb8695',
  },
  otpless: {
    clientId: '6B06C2ZKHM8R6D2SRG434K1RITXBJ37F',
    clientSecret: '14ot4tu6xecx8ojazk29arh2i0opc3lq',
  },
  fileUpload: { maxFileSize: 1000000, maxFiles: 10 },
};

export default (): Config => config;
