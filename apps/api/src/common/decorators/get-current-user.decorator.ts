import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// TODO: fix this, we should not have this type definition here
export type CurrentUser = {
  id: string;
  email: string;
  name: string;
  status: string;
  created_at: Date;
  updated_at: Date;
};

export const GetCurrentUser = createParamDecorator(
  (
    data: keyof CurrentUser | undefined,
    ctx: ExecutionContext,
  ): string | Date | CurrentUser => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as CurrentUser;

    if (!data) {
      return user;
    }

    return user[data];
  },
);
