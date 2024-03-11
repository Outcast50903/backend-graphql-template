import { Body, Controller, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { SignInInput, SingUpInput } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() singUpInput: SingUpInput) {
    return this.authService.signup(singUpInput);
  }

  @Post('signIn')
  async signIn(@Body() signInInput: SignInInput) {
    return this.authService.singIn(signInInput);
  }
}
