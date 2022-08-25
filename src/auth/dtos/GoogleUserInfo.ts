import { IsEmail, IsString } from "class-validator";



export class GoogleUserInfo {
  @IsString()
  googleUserId: string;

  @IsString()
  displayName: string;

  @IsEmail()
  email: string;
}
