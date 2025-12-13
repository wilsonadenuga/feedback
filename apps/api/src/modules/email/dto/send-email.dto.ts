export class SendEmailDto {
  to: string | string[];
  subject: string;
  html: string;
  payload?: Record<string, unknown>;
}
