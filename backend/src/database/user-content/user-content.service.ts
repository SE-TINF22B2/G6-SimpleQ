import { Injectable } from '@nestjs/common';
import { Answer, Discussion, Question, UserContent, UserContentType } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UserContentService {
  constructor(private prisma: PrismaService) {}

    // Question
    async createQuestion(ownerID: string, groupID: string, content: string | null, title: string): Promise<{ userContent: UserContent, question: Question }> {
        return this.prisma.$transaction(async (tx) => {
            const createdContent = await tx.userContent.create({
                data: {
                    ownerID: ownerID,
                    groupID: groupID,
                    content: content,
                    type: UserContentType.Question
                },
            })
            const createdQuestion = await tx.question.create({
                data: {
                    userContent: {
                        connect: createdContent
                    },
                    title: title
                },
            })
            return {
                userContent: createdContent,
                question: createdQuestion
            }
        });

    }

    async getQuestion(
        questionID: string
    ): Promise<{ userContent: UserContent | null, question: Question | null }> {
        const userContent = await this.prisma.userContent.findUnique({
            where: { userContentID: questionID }
        });
        const question = await this.prisma.question.findUnique({
            where: { userContentID: questionID },
        });
        return {
            userContent: userContent,
            question: question
        }
    }

    // Answer
    async createAnswer(ownerID: string | null, groupID: string, content: string | null, typeOfAI: string | null): Promise<{ userContent: UserContent, answer: Answer }> {
        return this.prisma.$transaction(async (tx) => {
            const createdContent = await tx.userContent.create({
                data: {
                    ownerID: ownerID,
                    groupID: groupID,
                    content: content,
                    type: UserContentType.Answer
                },
            })
            const createdAnswer = await tx.answer.create({
                data: {
                    userContent: {
                        connect: createdContent
                    },
                    typeOfAI: typeOfAI
                },
            })
            return {
                userContent: createdContent,
                answer: createdAnswer
            }
        });
    }

    async getAnswer(
        answerID: string
    ): Promise<{ userContent: UserContent | null, answer: Answer | null }> {
        const userContent = await this.prisma.userContent.findUnique({
            where: { userContentID: answerID }
        });
        const answer = await this.prisma.answer.findUnique({
            where: { userContentID: answerID },
        });
        return {
            userContent: userContent,
            answer: answer
        }
    }

    // Discussion
    async createDiscussion(ownerID: string, groupID: string, content: string | null, title: string, isPrivate: boolean): Promise<{ userContent: UserContent, discussion: Discussion }> {
        return this.prisma.$transaction(async (tx) => {
            const createdContent = await tx.userContent.create({
                data: {
                    ownerID: ownerID,
                    groupID: groupID,
                    content: content,
                    type: UserContentType.Answer
                },
            })
            const createdDiscussion = await tx.discussion.create({
                data: {
                    userContent: {
                        connect: createdContent
                    },
                    title: title,
                    isPrivate: isPrivate
                },
            })
            return {
                userContent: createdContent,
                discussion: createdDiscussion
            }
        });
    }

    async getDiscussion(
        answerID: string
    ): Promise<{ userContent: UserContent | null, discussion: Discussion | null }> {
        const userContent = await this.prisma.userContent.findUnique({
            where: { userContentID: answerID }
        });
        const discussion = await this.prisma.discussion.findUnique({
            where: { userContentID: answerID },
        });
        return {
            userContent: userContent,
            discussion: discussion
        }
    }
}
