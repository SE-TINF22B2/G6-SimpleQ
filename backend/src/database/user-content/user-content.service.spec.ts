import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma.service';
import { UserContentService } from './user-content.service';
import { testAnswer, testDiscussion, testQuestion, testUserContentAnswer, testUserContentDiscussion, testUserContentQuestion } from '../mockData';
import { mockPrisma } from '../mockedPrismaClient';

describe('UserContentService', () => {
  let service: UserContentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, UserContentService],
    }).overrideProvider(PrismaService)
      .useValue(mockPrisma).compile();

    service = module.get<UserContentService>(UserContentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new question', async () => {
    await expect(service.createQuestion(testUserContentQuestion.ownerID, testUserContentQuestion.groupID, testUserContentQuestion.content, testQuestion.title)).resolves.toEqual(
      { userContent: testUserContentQuestion, question: testQuestion }
    )
  });

  it('should get a question', async () => {
    await expect(service.getQuestion(testQuestion.userContentID)).resolves.toEqual(
      { userContent: testUserContentQuestion, question: testQuestion }
    )
  });

  it('should create a new answer', async () => {
    mockPrisma.userContent.create.mockResolvedValueOnce(testUserContentAnswer);
    await expect(service.createAnswer(testUserContentAnswer.ownerID, testUserContentAnswer.groupID, testUserContentAnswer.content, testAnswer.typeOfAI)).resolves.toEqual(
      { userContent: testUserContentAnswer, answer: testAnswer }
    )
  });

  it('should get a answer', async () => {
    mockPrisma.userContent.findUnique.mockResolvedValueOnce(testUserContentAnswer);
    await expect(service.getAnswer(testAnswer.userContentID)).resolves.toEqual(
      { userContent: testUserContentAnswer, answer: testAnswer }
    )
  });

  it('should create a new discussion', async () => {
    mockPrisma.userContent.create.mockResolvedValueOnce(testUserContentDiscussion);
    await expect(service.createDiscussion(testUserContentDiscussion.ownerID, testUserContentDiscussion.groupID, testUserContentDiscussion.content, testDiscussion.title, testDiscussion.isPrivate)).resolves.toEqual(
      { userContent: testUserContentDiscussion, discussion: testDiscussion }
    )
  });

  it('should get a discussion', async () => {
    mockPrisma.userContent.findUnique.mockResolvedValueOnce(testUserContentDiscussion);
    await expect(service.getDiscussion(testDiscussion.userContentID)).resolves.toEqual(
      { userContent: testUserContentDiscussion, discussion: testDiscussion }
    )
  });
});
