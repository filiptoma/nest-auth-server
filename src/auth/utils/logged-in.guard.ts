import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class LoggedInGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    // passport method that gets attached to request object if sessions are in use
    // on request object is a cookie with user's session id attached
    return context.switchToHttp().getRequest().isAuthenticated();
  }
}
