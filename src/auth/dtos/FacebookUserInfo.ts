import { IsEmail, IsString } from "class-validator";



export class FacebookUserInfo {
  @IsString()
  facebookUserId: string;

  @IsString()
  displayName: string;

  @IsEmail()
  email: string;
}
