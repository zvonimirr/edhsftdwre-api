import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from '@/users/users.service';
import { AuthService } from '@/auth/auth.service';
import { LoginDto } from '@/auth/dto/login.dto';
import { VerificationService } from '@/verification/verification.service';
import { VerifyDto } from '@/auth/dto/verify.dto';
import {
  createUserRegisterEvent,
  createUserVerifiedEvent,
} from '@/users/user.mq';
import { JobQueueService } from '@/job-queue/job-queue.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly verificationService: VerificationService,
    private readonly jobQueueService: JobQueueService,
  ) {}

  @Post('register')
  async register(@Body() body: LoginDto) {
    const user = await this.usersService.createUser(body);
    const code = await this.verificationService.createVerificationCode(user);
    await this.jobQueueService.sendTaskMessage(
      createUserRegisterEvent(user, code),
    );

    return user;
  }

  @Post('verify')
  async verify(@Body() { code }: VerifyDto) {
    const user = await this.verificationService.getUserByCode(code);
    const verifiedUser = await this.usersService.verifyUser(user);
    await this.jobQueueService.sendTaskMessage(
      createUserVerifiedEvent(verifiedUser, code),
    );

    return verifiedUser;
  }

  @Post('login')
  async login(@Body() body: LoginDto) {
    const user = await this.authService.validateUser(body);
    return this.authService.login(user);
  }
}
