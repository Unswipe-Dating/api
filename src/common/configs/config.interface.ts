import { S3Options } from 'src/uploader/interfaces';

export interface Config {
  nest: NestConfig;
  cors: CorsConfig;
  swagger: SwaggerConfig;
  graphql: GraphqlConfig;
  security: SecurityConfig;
  otpless: OTPLessConfig;
  fileUpload: FileUploadConfig;
  s3Config: S3Options;
  firebase: { [key: string]: string };
  reclaim: { [key: string]: string };
}

export interface FileUploadConfig {
  maxFileSize: number;
  maxFiles: number;
}
export interface OTPLessConfig {
  clientId: string;
  clientSecret: string;
}

export interface NestConfig {
  port: number;
}

export interface CorsConfig {
  enabled: boolean;
}

export interface SwaggerConfig {
  enabled: boolean;
  title: string;
  description: string;
  version: string;
  path: string;
}

export interface GraphqlConfig {
  playgroundEnabled: boolean;
  debug: boolean;
  schemaDestination: string;
  sortSchema: boolean;
}

export interface SecurityConfig {
  expiresIn: string;
  refreshIn: string;
  bcryptSaltOrRound: string | number;
  defaultPassword: string;
}
