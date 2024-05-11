import { Injectable } from '@nestjs/common';
import { Answer, Discussion, Prisma, Question } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UserContentService {
  constructor(private prisma: PrismaService) {}

  // Question
  async createQuestion(data: Prisma.QuestionCreateInput): Promise<Question> {
    return this.prisma.question.create({
      data,
    });
  }

  async getQuestion(
    questionWhereUniqueInput: Prisma.QuestionWhereUniqueInput,
  ): Promise<Question | null> {
    return this.prisma.question.findUnique({
      where: questionWhereUniqueInput,
    });
  }

  // Answer
  async createAnswer(data: Prisma.AnswerCreateInput): Promise<Answer> {
    return this.prisma.answer.create({
      data,
    });
  }

  async getAnswer(
    answerWhereUniqueInput: Prisma.AnswerWhereUniqueInput,
  ): Promise<Answer | null> {
    return this.prisma.answer.findUnique({
      where: answerWhereUniqueInput,
    });
  }

  // Discussion
  async createDiscussion(
    data: Prisma.DiscussionCreateInput,
  ): Promise<Discussion> {
    return this.prisma.discussion.create({
      data,
    });
  }

  async getDiscussion(
    discussionWhereUniqueInput: Prisma.DiscussionWhereUniqueInput,
  ): Promise<Discussion | null> {
    return this.prisma.discussion.findUnique({
      where: discussionWhereUniqueInput,
    });
  }
}
