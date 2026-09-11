import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import {
  Channel,
  ChannelModel,
  ConsumeMessage,
  RecoveringChannelModel,
  connect,
} from 'amqplib';
import {
  JobQueueSchema,
  JobQueueTask,
  MQ_EXCHANGE,
  MQ_QUEUE,
  MQ_ROUTING_KEY,
} from '@/job-queue/job-queue.constants';
import { MailerService } from '@nestjs-modules/mailer';
import { UsersService } from '@/users/users.service';
import { NotificationCreatedEventSchema } from '@/notifications/notification.mq';
import {
  UserRegisteredEventSchema,
  UserVerifiedEventSchema,
} from '@/users/user.mq';
import { VerificationService } from '@/verification/verification.service';

@Injectable()
export class JobQueueService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(JobQueueService.name);
  private connection: RecoveringChannelModel;
  private channel: Channel;

  constructor(
    private readonly mailerService: MailerService,
    private readonly usersService: UsersService,
    private readonly verificationService: VerificationService,
  ) {}

  async onModuleInit() {
    this.connection = await connect(process.env.RABBITMQ_URL, {
      recovery: {
        setup: (model: ChannelModel) => this.setupChannel(model),
      },
    });

    this.connection.on('disconnect', (err) =>
      this.logger.warn(`RabbitMQ disconnected: ${err.message}`),
    );
  }

  async onModuleDestroy() {
    await this.channel?.close();
    await this.connection?.close();
  }

  private async setupChannel(model: ChannelModel) {
    const channel = await model.createChannel();

    await channel.assertExchange(MQ_EXCHANGE, 'direct', { durable: true });
    await channel.assertQueue(MQ_QUEUE, { durable: true });
    await channel.bindQueue(MQ_QUEUE, MQ_EXCHANGE, MQ_ROUTING_KEY);
    await channel.prefetch(1);
    await channel.consume(MQ_QUEUE, (message) => this.handleMessage(message));

    this.channel = channel;
  }

  private async handleMessage(message: ConsumeMessage | null) {
    if (!message) {
      return;
    }

    try {
      const task = JSON.parse(message.content.toString());
      await this.handleTaskMessage(task);
      this.channel.ack(message);
    } catch (error) {
      this.logger.error(
        `Failed to process message: ${(error as Error).message}`,
        (error as Error).stack,
      );
      this.channel.nack(message, false, false);
    }
  }

  private async handleTaskMessage(message: unknown) {
    this.logger.log(`Received message: ${JSON.stringify(message)}`);

    const task = JobQueueSchema.parse(message);

    switch (task.type) {
      case JobQueueTask.NOTIFICATION_CREATED:
        {
          const { payload } = NotificationCreatedEventSchema.parse(message);
          const user = await this.usersService.findNotifiableUserById(
            payload.userId,
          );

          if (user) {
            this.logger.log(`Sending notification to user: ${user.email}`);
            await this.mailerService.sendMail({
              to: user.email,
              subject: 'New Notification',
              template: './notification',
              context: {
                message: payload.message,
              },
            });
          }
        }
        break;

      case JobQueueTask.USER_REGISTERED:
        {
          const { payload } = UserRegisteredEventSchema.parse(message);

          this.logger.log(
            `Sending verification email to user: ${payload.email}`,
          );
          await this.mailerService.sendMail({
            to: payload.email,
            subject: 'Verify your email',
            template: './verify',
            context: {
              code: payload.code,
            },
          });
        }
        break;

      case JobQueueTask.USER_VERIFIED:
        {
          const { payload } = UserVerifiedEventSchema.parse(message);

          this.logger.log(
            `Removing verification code for user: ${payload.email}`,
          );
          await this.verificationService.removeVerificationCode(payload.code);
        }
        break;
    }
  }

  public sendTaskMessage(msg: unknown) {
    this.logger.log(`Sending message: ${JSON.stringify(msg)}`);

    this.channel.publish(
      MQ_EXCHANGE,
      MQ_ROUTING_KEY,
      Buffer.from(JSON.stringify(msg)),
      {
        persistent: true,
        contentType: 'application/json',
      },
    );
  }
}
