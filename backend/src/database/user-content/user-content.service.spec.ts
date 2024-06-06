import { Test, TestingModule } from '@nestjs/testing';
import {
  testAnswer,
  testDiscussion,
  testQuestion,
  testTagList,
  testUserContentAnswer,
  testUserContentDiscussion,
  testUserContentQuestion,
  testUserContentQuestionList,
  testVoteList,
} from '../mockData';
import { PrismaService } from '../prisma.service';
import { UserContentService } from './user-content.service';
import { mockPrisma } from '../mockedPrismaClient';

describe('UserContentService', () => {
  let service: UserContentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, UserContentService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrisma)
      .compile();

    service = module.get<UserContentService>(UserContentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new question', async () => {
    await expect(
      service.createQuestion(
        testUserContentQuestion.ownerID,
        testUserContentQuestion.content,
        testQuestion.title,
        testTagList.map((t) => t.tagname),
      ),
    ).resolves.toEqual({
      userContent: testUserContentQuestion,
      question: testQuestion,
    });
  });

  it('should get a question', async () => {
    await expect(
      service.getQuestion(testQuestion.userContentID),
    ).resolves.toEqual({
      userContent: testUserContentQuestion,
      question: testQuestion,
    });
  });

  it('should get a list of questions', async () => {
    await expect(service.getTrendingQuestions()).resolves.toEqual(
      testUserContentQuestionList,
    );
  });

  it('should get all tags of the question', async () => {
    const questionWithTags: any = testUserContentQuestion;
    questionWithTags.tags = testTagList;
    mockPrisma.userContent.findUnique.mockResolvedValueOnce(questionWithTags);
    await expect(
      service.getTagsOfUserContent(testUserContentQuestion.userContentID),
    ).resolves.toEqual(testTagList);
  });

  it('should get likes and dislikes of the question', async () => {
    const questionWithVotes: any = testUserContentQuestion;
    questionWithVotes.votes = testVoteList;
    mockPrisma.userContent.findUnique.mockResolvedValueOnce(questionWithVotes);
    await expect(
      service.getLikesAndDislikesOfUserContent(
        testUserContentQuestion.userContentID,
      ),
    ).resolves.toEqual({ likes: 2, dislikes: 1 });
  });

  it('should get number of answers', async () => {
    await expect(
      service.getNumberOfAnswersFromGroupID(testUserContentQuestion.groupID),
    ).resolves.toEqual(5);
  });

  it('should create a new answer', async () => {
    mockPrisma.userContent.create.mockResolvedValueOnce(testUserContentAnswer);
    await expect(
      service.createAnswer(
        testUserContentAnswer.ownerID,
        testUserContentAnswer.groupID,
        testUserContentAnswer.content,
        testAnswer.typeOfAI,
      ),
    ).resolves.toEqual({
      userContent: testUserContentAnswer,
      answer: testAnswer,
    });
  });

  it('should get a answer', async () => {
    mockPrisma.userContent.findUnique.mockResolvedValueOnce(
      testUserContentAnswer,
    );
    await expect(service.getAnswer(testAnswer.userContentID)).resolves.toEqual({
      userContent: testUserContentAnswer,
      answer: testAnswer,
    });
  });

  it('should create a new discussion', async () => {
    mockPrisma.userContent.create.mockResolvedValueOnce(
      testUserContentDiscussion,
    );
    await expect(
      service.createDiscussion(
        testUserContentDiscussion.ownerID,
        testUserContentDiscussion.content,
        testDiscussion.title,
        testDiscussion.isPrivate,
        testTagList.map((t) => t.tagname),
      ),
    ).resolves.toEqual({
      userContent: testUserContentDiscussion,
      discussion: testDiscussion,
    });
  });

  it('should get a discussion', async () => {
    mockPrisma.userContent.findUnique.mockResolvedValueOnce(
      testUserContentDiscussion,
    );
    await expect(
      service.getDiscussion(testDiscussion.userContentID),
    ).resolves.toEqual({
      userContent: testUserContentDiscussion,
      discussion: testDiscussion,
    });
  });
});
