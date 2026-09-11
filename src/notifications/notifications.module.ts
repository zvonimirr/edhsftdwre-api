import { Module } from '@nestjs/common';
import { NotificationsGateway } from '@/notifications/notifications.gateway';
import { NotificationsService } from '@/notifications/notifications.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Notification,
  NotificationSchema,
} from '@/notifications/notification.schema';
import { NotificationsController } from '@/notifications/notifications.controller';
import { JobQueueModule } from '@/job-queue/job-queue.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
    ]),
    JobQueueModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [NotificationsGateway, NotificationsService],
  controllers: [NotificationsController],
})
export class NotificationsModule {}
