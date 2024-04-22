// database.service.ts
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

export const prismaExtendedClient = (prismaClient: PrismaClient) =>
  prismaClient.$extends({
    name: 'ExtendedJSONStringifiedProfile',
    result: {
      profile: {
        interests: {
          needs: { interests: true },
          compute(profile) {
            return JSON.parse(profile.interests);
          },
        },
      },
    },
    query: {
      profile: {
        async update({ args, query }) {
          if (args.data?.interests) {
            args.data = {
              ...args.data,
              interests: JSON.stringify(args.data.interests),
            };
          }

          return query(args);
        },
        async create({ args, query }) {
          if (args.data?.interests) {
            args.data = {
              ...args.data,
              interests: JSON.stringify(args.data.interests),
            };
          }
          return query(args);
        },
      },
    },
  });

@Injectable()
export class DatabaseService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  readonly extendedClient = prismaExtendedClient(this);

  constructor() {
    super();

    new Proxy(this, {
      get: (target, property) =>
        Reflect.get(
          property in this.extendedClient ? this.extendedClient : target,
          property,
        ),
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
