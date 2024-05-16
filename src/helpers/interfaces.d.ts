import User from '../database/model/User';  


declare interface ProtectedRequest extends Request  {
    user: User;
    accessToken: string;
  }