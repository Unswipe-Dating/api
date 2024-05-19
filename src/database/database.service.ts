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
      request: {
        challenge: {
          needs: { challenge: true },
          compute(request) {
            return JSON.parse(request.challenge);
          },
        },
        challengeVerification: {
          needs: { challengeVerification: true },
          compute(request) {
            return JSON.parse(request.challengeVerification);
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
        async upsert({ args, query }) {
          if (args.create?.interests) {
            args.create = {
              ...args.create,
              interests: JSON.stringify(args.create.interests),
            };
          }
          if (args.update?.interests) {
            args.update = {
              ...args.update,
              interests: JSON.stringify(args.update.interests),
            };
          }
          return query(args);
        },
      },
      request: {
        async create({ args, query }) {
          if (args.data?.challenge) {
            args.data = {
              ...args.data,
              challenge: JSON.stringify(args.data.challenge),
            };
          }
          if (args.data?.challengeVerification) {
            args.data = {
              ...args.data,
              challengeVerification: JSON.stringify(
                args.data.challengeVerification,
              ),
            };
          }
          return query(args);
        },
        async update({ args, query }) {
          if (args.data?.challenge) {
            args.data = {
              ...args.data,
              challenge: JSON.stringify(args.data.challenge),
            };
          }
          if (args.data?.challengeVerification) {
            args.data = {
              ...args.data,
              challengeVerification: JSON.stringify(
                args.data.challengeVerification,
              ),
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
