import { Answer, Blacklist, Discussion, Expert, Favorite, LoginAttempt, Moderation, Quest, Question, QuestType, Tag, User, UserContent, UserContentType, UserQuest, UserTimeout, Vote } from "@prisma/client";

const dateTime = new Date(2024, 1, 1, 11, 59);

export const testBlacklistItem: Blacklist = { name: 'test' };
export const testBlacklist: Blacklist[] = [
  { name: 'test1' },
  { name: 'test2' }
]

export const testTag: Tag = {
  tagname: "testtag"
}

export const testTagList: Tag[] = [
  { tagname: "tagname1" },
  { tagname: "a_testtagname" },
  { tagname: "b_tag" },
  { tagname: "testtag" },
  { tagname: "testtagname" },
  { tagname: "z_tagname" }
]

export const testUser: User = {
  userID: "userID",
  username: "username",
  isPro: false,
  isAdmin: false,
  timeOfRegistration: dateTime,
  activityPoints: 0,
  email: "test@email.com"
}

export const testExpert: Expert = {
  expertUserID: testUser.userID,
  tagname: testTag.tagname,
  expertPoints: 100
}

export const testUserContentQuestion: UserContent = {
  userContentID: "contentID",
  ownerID: testUser.userID,
  groupID: "groupID",
  content: "testContent",
  timeOfCreation: dateTime,
  type: UserContentType.Question
}

export const testUserContentDiscussion: UserContent = {
  userContentID: "contentID2",
  ownerID: testUser.userID,
  groupID: "groupID2",
  content: "testContent",
  timeOfCreation: dateTime,
  type: UserContentType.Discussion
}

export const testUserContentAnswer: UserContent = {
  userContentID: "contentID3",
  ownerID: testUser.userID,
  groupID: "groupID2",
  content: "testContent",
  timeOfCreation: dateTime,
  type: UserContentType.Answer
}

export const testQuestion: Question = {
  userContentID: testUserContentQuestion.userContentID,
  title: "testTitle"
}

export const testDiscussion: Discussion = {
  userContentID: testUserContentDiscussion.userContentID,
  title: "testTitle",
  isPrivate: true
}

export const testAnswer: Answer = {
  userContentID: testUserContentAnswer.userContentID,
  typeOfAI: null
}

export const testFavorite: Favorite = {
  contentID: testQuestion.userContentID,
  favoriteUserID: testUser.userID
}

export const testLoginAttempt: LoginAttempt = {
  loginUserID: testUser.userID,
  timeOfLogin: dateTime,
  wasSuccessful: true
}

export const testModeration: Moderation = {
  moderationID: "moderationID",
  moderatorID: testUser.userID,
  discussionID: testDiscussion.userContentID
}

export const testQuest: Quest = {
  questID: "questID",
  name: "name",
  description: "description",
  type: QuestType.AcivityQuest,
  points: 5,
  isSelected: false
}

export const testUserQuest: UserQuest = {
  questID: testQuest.questID,
  questUserID: testUser.userID,
  done: false
}

export const testUserTimeout: UserTimeout = {
  timeoutedUserID: testUser.userID,
  moderationID: testModeration.moderationID,
  contentID: testDiscussion.userContentID,
  timeout: dateTime
}

export const testVote: Vote = {
  contentID: testUserContentQuestion.userContentID,
  votingUserID: testUser.userID,
  isPositive: true
}