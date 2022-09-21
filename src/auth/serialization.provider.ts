import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { User } from './models/user.interface';

type SerializedUser = {
  id: number;
  role: string;
};
type SerializeCb = (err: Error | null, user: SerializedUser) => void;
type DeserializeCb = (err: Error | null, user: Omit<User, 'password'>) => void;

@Injectable()
export class AuthSerializer extends PassportSerializer {
  constructor(private readonly authService: AuthService) {
    super();
  }

  serializeUser(user: User, done: SerializeCb) {
    done(null, { id: user.id, role: user.role });
  }

  // note: usually call to DB to retrieve user (from UserService)
  deserializeUser(payload: SerializedUser, done: DeserializeCb) {
    done(null, this.authService.findById(payload.id));
  }
}
