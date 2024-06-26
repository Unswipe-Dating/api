/* eslint-disable */
export default async () => {
  const t = {
    ['./users/models/user.model']: await import('./users/models/user.model'),
  };
  return {
    '@nestjs/swagger/plugin': {
      models: [],
      controllers: [
        [
          import('./app.controller'),
          {
            AppController: {
              getHello: { type: String },
              getHelloName: { type: String },
            },
          },
        ],
      ],
    },
    '@nestjs/graphql/plugin': {
      models: [
        [
          import('./auth/dto/signup.input'),
          {
            SignupInput: {
              id: {},
              phone: {},
              email: {},
              country: {},
              tAndCConsent: {},
            },
          },
        ],
        [
          import('./auth/models/token.model'),
          { Token: { accessToken: {}, refreshToken: {} } },
        ],
        [
          import('./users/dto/change-password.input'),
          { ChangePasswordInput: { oldPassword: {}, newPassword: {} } },
        ],
        [
          import('./common/models/base.model'),
          { BaseModel: { id: {}, createdAt: {}, updatedAt: {} } },
        ],
        [
          import('./profiles/models/profile.model'),
          {
            Profile: {
              title: {},
              content: { nullable: true },
              published: {},
              user: { nullable: true },
            },
          },
        ],
        [
          import('./users/models/user.model'),
          {
            User: {
              id: {},
              phone: {},
              email: {},
              firstname: { nullable: true },
              lastname: { nullable: true },
              role: {},
              posts: { nullable: true },
              country: {},
              tAndCConsent: {},
            },
          },
        ],
        [
          import('./auth/models/auth.model'),
          {
            Auth: { user: { type: () => t['./users/models/user.model'].User } },
          },
        ],
        [
          import('./auth/dto/login.input'),
          { LoginInput: { id: {}, phone: {}, otp: {}, otpOrderId: {} } },
        ],
        [
          import('./auth/dto/refresh-token.input'),
          { RefreshTokenInput: { token: {}, userId: {} } },
        ],
        [import('./auth/models/otp.model'), { Otp: { orderId: {} } }],
        [
          import('./users/dto/update-user.input'),
          {
            UpdateUserInput: {
              firstname: { nullable: true },
              lastname: { nullable: true },
            },
          },
        ],
        [
          import('./profiles/args/post-id.args'),
          { PostIdArgs: { profileId: { type: () => String } } },
        ],
        [
          import('./profiles/args/user-id.args'),
          { UserIdArgs: { userId: { type: () => String } } },
        ],
        [
          import('./profiles/dto/upsertProfile.input'),
          { CreateProfileInput: { content: {}, title: {} } },
        ],
        [
          import('./common/pagination/pagination.args'),
          {
            PaginationArgs: {
              skip: { nullable: true, type: () => Number },
              after: { nullable: true, type: () => String },
              before: { nullable: true, type: () => String },
              first: { nullable: true, type: () => Number },
              last: { nullable: true, type: () => Number },
            },
          },
        ],
        [
          import('./common/pagination/page-info.model'),
          {
            PageInfo: {
              endCursor: { nullable: true },
              hasNextPage: {},
              hasPreviousPage: {},
              startCursor: { nullable: true },
            },
          },
        ],
      ],
    },
  };
};
