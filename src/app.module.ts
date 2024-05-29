import { GraphQLModule } from '@nestjs/graphql';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule, loggingMiddleware } from 'nestjs-prisma';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppResolver } from './app.resolver';
import { AuthModule } from './auth/auth.module';
import { UploaderModule } from './uploader/uploader.module';
import { UsersModule } from './users/users.module';
import { ProfileModule } from './profiles/profiles.module';
import config from './common/configs/config';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GqlConfigService } from './gql-config.service';
import { S3Options } from './uploader/interfaces';
import { RequestModule } from './request/request.module';
import { FirebaseService } from './firebase/firebase.service';
import { FirebaseModule } from './firebase/firebase.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        middlewares: [
          // configure your prisma middleware
          loggingMiddleware({
            logger: new Logger('PrismaMiddleware'),
            logLevel: 'log',
          }),
        ],
      },
    }),

    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useClass: GqlConfigService,
    }),

    AuthModule,
    UsersModule,
    ProfileModule,
    FirebaseModule,
    UploaderModule.forRoot({
      clientConfig: {
        region: 'ap-southeast-1',
        credentials: {
          accessKeyId: '',
          secretAccessKey: '',
        },
      },
      bucketData: {
        name: 'test',
        folder: 'test-folder',
        appUuid: 'uuid',
        url: '',
      },
    }),
    RequestModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppResolver],
})
export class AppModule {}
