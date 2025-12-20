import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export type WorkspaceMember = {
  id: string;
  role: string;
  workspace_id: string;
  user_id: string;
};

export const GetWorkspaceMember = createParamDecorator(
  (
    data: keyof WorkspaceMember | undefined,
    ctx: ExecutionContext,
  ): string | WorkspaceMember => {
    const request = ctx.switchToHttp().getRequest();
    const member = request.workspaceMember as WorkspaceMember;

    if (!data) {
      return member;
    }

    return member[data];
  },
);
