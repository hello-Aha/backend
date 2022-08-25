import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as twilio from 'twilio';

@Injectable()
export class VerifyService {
  client: twilio.Twilio;
  twilioServiceSID: string;
  constructor(configService: ConfigService) {
    this.twilioServiceSID = configService.get<string>('TWILIO_SERVICE_SID');
    this.client = twilio(
      configService.get<string>('TWILIO_ACCOUNT_SID'),
      configService.get<string>('TWILIO_AUTH_TOKEN'),
    );
  }

  async sendEmail(email: string, displayName: string) {
    await this.client.verify.v2
      .services(this.twilioServiceSID)
      .verifications.create({
        channelConfiguration: {
          substitutions: {
            displayName: displayName,
            email,
          },
        },
        to: email,
        channel: 'email',
      });
  }

  async verifyByEmail(email: string, code: string): Promise<boolean> {
    console.log(email)
    console.log(code)
    const verificationCheck = await this.client.verify.v2
      .services(this.twilioServiceSID)
      .verificationChecks.create({ to: email, code });
    return verificationCheck.valid;

  }
}
