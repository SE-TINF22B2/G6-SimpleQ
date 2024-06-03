import { PrismaClient } from '@prisma/client';
import { mockDeep } from 'jest-mock-extended';
import {
  testAnswer,
  testBlacklist,
  testBlacklistItem,
  testDiscussion,
  testExpert,
  testFavorite,
  testLoginAttempt,
  testModeration,
  testQuest,
  testQuestion,
  testTag,
  testUser,
  testUserContentQuestion,
  testUserContentQuestionList,
  testUserQuest,
  testUserTimeout,
  testVote,
} from './mockData';

jest.mock('./prisma.service', () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}));

beforeAll(() => {
  mockPrisma.$transaction.mockImplementation((callback) => {
    return callback(mockPrisma);
  });

  mockPrisma.blacklist.create.mockResolvedValue(testBlacklistItem);
  mockPrisma.blacklist.findUnique.mockResolvedValue(testBlacklistItem);
  mockPrisma.blacklist.findMany.mockResolvedValue(testBlacklist);

  mockPrisma.expert.create.mockResolvedValue(testExpert);
  mockPrisma.expert.findUnique.mockResolvedValue(testExpert);

  mockPrisma.favorite.create.mockResolvedValue(testFavorite);
  mockPrisma.favorite.findUnique.mockResolvedValue(testFavorite);

  mockPrisma.loginAttempt.create.mockResolvedValue(testLoginAttempt);
  mockPrisma.loginAttempt.findUnique.mockResolvedValue(testLoginAttempt);

  mockPrisma.moderation.create.mockResolvedValue(testModeration);
  mockPrisma.moderation.findUnique.mockResolvedValue(testModeration);

  mockPrisma.quest.create.mockResolvedValue(testQuest);
  mockPrisma.quest.findUnique.mockResolvedValue(testQuest);

  mockPrisma.tag.create.mockResolvedValue(testTag);
  mockPrisma.tag.findUnique.mockResolvedValue(testTag);

  mockPrisma.user.create.mockResolvedValue(testUser);
  mockPrisma.user.findUnique.mockResolvedValue(testUser);
  mockPrisma.user.update.mockResolvedValue(testUser);

  mockPrisma.userContent.create.mockResolvedValue(testUserContentQuestion);
  mockPrisma.userContent.findUnique.mockResolvedValue(testUserContentQuestion);
  mockPrisma.userContent.findMany.mockResolvedValue(
    testUserContentQuestionList,
  );
  mockPrisma.userContent.count.mockResolvedValue(5);
  mockPrisma.question.create.mockResolvedValue(testQuestion);
  mockPrisma.question.findUnique.mockResolvedValue(testQuestion);
  mockPrisma.answer.create.mockResolvedValue(testAnswer);
  mockPrisma.answer.findUnique.mockResolvedValue(testAnswer);
  mockPrisma.discussion.create.mockResolvedValue(testDiscussion);
  mockPrisma.discussion.findUnique.mockResolvedValue(testDiscussion);

  mockPrisma.userQuest.create.mockResolvedValue(testUserQuest);
  mockPrisma.userQuest.findUnique.mockResolvedValue(testUserQuest);
  mockPrisma.userQuest.createMany.mockResolvedValue({ count: 3 });

  mockPrisma.userTimeout.create.mockResolvedValue(testUserTimeout);
  mockPrisma.userTimeout.findUnique.mockResolvedValue(testUserTimeout);

  mockPrisma.vote.create.mockResolvedValue(testVote);
  mockPrisma.vote.findUnique.mockResolvedValue(testVote);
});

export const mockPrisma = mockDeep<PrismaClient>();
