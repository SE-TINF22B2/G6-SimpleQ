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

export enum Registration { // TODO extract
  registered = 'registered',
  proUser = 'proUser',
  admin = 'admin',
}
