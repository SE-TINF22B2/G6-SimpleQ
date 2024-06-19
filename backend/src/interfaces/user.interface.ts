export interface IUser {
  userID?: string;
  username?: string;
  profilePicture?: null;
  registrationDate: Date | undefined;
  accountState: Registration;
  expertTopics: IExpertTopics[];
  userStatistics: object;
  activityPoints: number;
}

export interface IExpertTopics {
  tagname: string;
  expertPoints: number;
}

export enum Registration {
  guest = 'guest',
  user = 'user',
  pro = 'pro',
  admin = 'admin',
  ai = 'ai',
}
