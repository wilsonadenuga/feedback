import { Injectable, Logger } from '@nestjs/common';
import { ResendService } from './resend.service';
import { SendEmailDto } from '../dto/send-email.dto';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly resendService: ResendService) {}

  async sendEmail(dto: SendEmailDto) {
    this.logger.log(`Sending email to ${dto.to}`);
    const result = await this.resendService.sendEmail(dto);

    this.logger.log(
      `Email successfully sent to ${dto.to}. ID: ${result.data?.id}`,
    );

    return result;
  }
}
