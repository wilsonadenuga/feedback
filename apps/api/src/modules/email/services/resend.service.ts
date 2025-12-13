import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { SendEmailDto } from '../dto/send-email.dto';

@Injectable()
export class ResendService {
  private resend: Resend;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('resend.apiKey');
    this.resend = new Resend(apiKey);
  }

  async sendEmail(params: SendEmailDto) {
    return await this.resend.emails.send({
      ...params,
      from: 'onboarding@resend.dev',
    });
  }
}
