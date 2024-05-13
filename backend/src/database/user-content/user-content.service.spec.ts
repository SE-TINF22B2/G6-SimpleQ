import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma.service';
import { UserContentService } from './user-content.service';
import { testAnswer, testDiscussion, testQuestion, testUserContentAnswer, testUserContentDiscussion, testUserContentQuestion } from '../mockData';
import { PrismaClient } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';

describe('UserContentService', () => {
  let service: UserContentService;
  let mockPrisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, UserContentService],
    }).overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>()).compile();

    service = module.get<UserContentService>(UserContentService);
    mockPrisma = module.get(PrismaService);
    mockPrisma.$transaction.mockImplementation((callback) => {
      return callback(mockPrisma)
    })
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new question', async () => {
    mockPrisma.userContent.create.mockResolvedValue(testUserContentQuestion);
    mockPrisma.question.create.mockResolvedValue(testQuestion);
    await expect(service.createQuestion(testUserContentQuestion.ownerID, testUserContentQuestion.groupID, testUserContentQuestion.content, testQuestion.title)).resolves.toEqual(
      { userContent: testUserContentQuestion, question: testQuestion }
    )
  });

  it('should get a question', async () => {
    mockPrisma.userContent.findUnique.mockResolvedValue(testUserContentQuestion);
    mockPrisma.question.findUnique.mockResolvedValue(testQuestion);
    await expect(service.getQuestion(testQuestion.userContentID)).resolves.toEqual(
      { userContent: testUserContentQuestion, question: testQuestion }
    )
  });

  it('should create a new answer', async () => {
    mockPrisma.userContent.create.mockResolvedValue(testUserContentAnswer);
    mockPrisma.answer.create.mockResolvedValue(testAnswer);
    await expect(service.createAnswer(testUserContentAnswer.ownerID, testUserContentAnswer.groupID, testUserContentAnswer.content, testAnswer.typeOfAI)).resolves.toEqual(
      { userContent: testUserContentAnswer, answer: testAnswer }
    )
  });

  it('should get a answer', async () => {
    mockPrisma.userContent.findUnique.mockResolvedValue(testUserContentAnswer);
    mockPrisma.answer.findUnique.mockResolvedValue(testAnswer);
    await expect(service.getAnswer(testAnswer.userContentID)).resolves.toEqual(
      { userContent: testUserContentAnswer, answer: testAnswer }
    )
  });

  it('should create a new discussion', async () => {
    mockPrisma.userContent.create.mockResolvedValue(testUserContentDiscussion);
    mockPrisma.discussion.create.mockResolvedValue(testDiscussion);
    await expect(service.createDiscussion(testUserContentDiscussion.ownerID, testUserContentDiscussion.groupID, testUserContentDiscussion.content, testDiscussion.title, testDiscussion.isPrivate)).resolves.toEqual(
      { userContent: testUserContentDiscussion, discussion: testDiscussion }
    )
  });

  it('should get a discussion', async () => {
    mockPrisma.userContent.findUnique.mockResolvedValue(testUserContentDiscussion);
    mockPrisma.discussion.findUnique.mockResolvedValue(testDiscussion);
    await expect(service.getDiscussion(testDiscussion.userContentID)).resolves.toEqual(
      { userContent: testUserContentDiscussion, discussion: testDiscussion }
    )
  });
});
