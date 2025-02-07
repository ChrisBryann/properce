import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { PublicUser } from 'apps/users/src/entities/user.entity';

export const CurrentUserDecorator = createParamDecorator(
  (_data: unknown, context: ExecutionContext) =>
    context.switchToHttp().getRequest().user as PublicUser,
);
