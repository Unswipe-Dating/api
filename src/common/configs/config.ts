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
};

export default (): Config => config;
