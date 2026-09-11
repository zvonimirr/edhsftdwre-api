import { Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UUIDService {
  private readonly logger = new Logger(UUIDService.name);

  async getV4() {
    const uuid = uuidv4();
    this.logger.log(`Generated UUID v4: ${uuid}`);
    return {
      uuid,
    };
  }
}
