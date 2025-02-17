import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JsonWebTokenError } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // TODO: auth gateway guard does not catch this invalid token exception and just return default error
  handleRequest(err: any, user: any, info: any, context: any, status: any) {
    if (info instanceof JsonWebTokenError) {
      throw new UnauthorizedException('Invalid Token!');
    }
    console.log('info');
    return super.handleRequest(err, user, info, context, status);
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    try{
      return super.canActivate(context)
    } catch(error) {
      console.log(error);
      throw new UnauthorizedException('Invalid Token!');
    }
  }
}
