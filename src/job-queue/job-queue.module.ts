import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { MQ_CHANNEL, MQ_EXCHANGE } from '@/job-queue/job-queue.constants';
import { JobQueueService } from '@/job-queue/job-queue.service';
import { UsersModule } from '@/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { VerificationModule } from '@/verification/verification.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RabbitMQModule.forRoot({
      uri: process.env.RABBITMQ_URL,
      exchanges: [
        {
          name: MQ_EXCHANGE,
          type: 'direct',
        },
      ],
      channels: {
        [MQ_CHANNEL]: {
          default: true,
        },
      },
    }),
    UsersModule,
    VerificationModule,
  ],
  providers: [JobQueueService],
  exports: [JobQueueService],
})
export class JobQueueModule {}
