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
        work: {
          needs: { work: true },
          compute(profile) {
            return JSON.parse(profile.work);
          },
        },
        lifestyle: {
          needs: { lifestyle: true },
          compute(profile) {
            return JSON.parse(profile.lifestyle);
          },
        },
        values: {
          needs: { values: true },
          compute(profile) {
            return JSON.parse(profile.values);
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
          if (args.data?.work) {
            args.data = {
              ...args.data,
              work: JSON.stringify(args.data.work),
            };
          }
          if (args.data?.lifestyle) {
            args.data = {
              ...args.data,
              lifestyle: JSON.stringify(args.data.lifestyle),
            };
          }
          if (args.data?.values) {
            args.data = {
              ...args.data,
              values: JSON.stringify(args.data.values),
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
          if (args.data?.work) {
            args.data = {
              ...args.data,
              work: JSON.stringify(args.data.work),
            };
          }
          if (args.data?.lifestyle) {
            args.data = {
              ...args.data,
              lifestyle: JSON.stringify(args.data.lifestyle),
            };
          }
          if (args.data?.values) {
            args.data = {
              ...args.data,
              values: JSON.stringify(args.data.values),
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
            if (args.create?.work) {
              args.create = {
                ...args.create,
                work: JSON.stringify(args.create.work),
              };
            }
            if (args.create?.lifestyle) {
              args.create = {
                ...args.create,
                lifestyle: JSON.stringify(args.create.lifestyle),
              };
            }
            if (args.create?.values) {
              args.create = {
                ...args.create,
                values: JSON.stringify(args.create.values),
              };
            }
          }
          if (args.update?.interests) {
            args.update = {
              ...args.update,
              interests: JSON.stringify(args.update.interests),
            };
            if (args.update?.work) {
              args.update = {
                ...args.update,
                work: JSON.stringify(args.update.work),
              };
            }
            if (args.update?.lifestyle) {
              args.update = {
                ...args.update,
                lifestyle: JSON.stringify(args.update.lifestyle),
              };
            }
            if (args.update?.values) {
              args.update = {
                ...args.update,
                values: JSON.stringify(args.update.values),
              };
            }
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
  implements OnModuleInit, OnModuleDestroy {
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
