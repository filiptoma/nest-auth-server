import { ExecutionContext, Injectable } from '@nestjs/common';
import { LoggedInGuard } from './logged-in.guard';

@Injectable()
export class AdminGuard extends LoggedInGuard {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    // checks for logged in && user role which is saved in redis session
    return (
      super.canActivate(context) && req.session.passport.user.role === 'admin'
    );
  }
}
