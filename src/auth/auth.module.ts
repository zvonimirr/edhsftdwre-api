import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from '@/auth/auth.service';
import { UsersModule } from '@/users/users.module';
import { AuthController } from '@/auth/auth.controller';
import { JwtStrategy } from '@/auth/jwt.strategy';
import { ConfigModule } from '@nestjs/config';
import { VerificationModule } from '@/verification/verification.module';
import { JobQueueModule } from '@/job-queue/job-queue.module';

@Global()
@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    UsersModule,
    VerificationModule,
    JobQueueModule,
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [PassportModule],
})
export class AuthModule {}
