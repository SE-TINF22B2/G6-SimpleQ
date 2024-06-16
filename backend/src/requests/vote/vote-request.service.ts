import { Injectable, NotFoundException } from '@nestjs/common';
import { UserContentService } from '../../database/user-content/user-content.service';
import { Vote } from '@prisma/client';
import { VoteDto } from './dto/vote.dto';
import { VOTE_OPTIONS } from '../../../config';
import { VoteService } from '../../database/vote/vote.service';
import { UserContentRequestService } from '../user-content-request/user-content-request.service';
import { IAnswer, IQuestion } from '../questions/dto/user-content-interface';

@Injectable()
export class VoteRequestService {
  constructor(
    private readonly userContentService: UserContentService,
    private readonly voteService: VoteService,
    private readonly userContentRequestService: UserContentRequestService,
  ) {}

  /**
   * set vote for one userContentId for one user,
   * removes the vote if the parameter vote is set to 'none'
   * @param vote
   * @param userContentId
   * @param userId
   * @throws NotFoundException
   */
  async updateUserVote(
    vote: VoteDto,
    userContentId: string,
    userId: string,
  ): Promise<IQuestion | IAnswer | null> {
    // check question exists
    const author =
      await this.userContentService.getAuthorOfUserContent(userContentId);
    if (author == null) {
      throw new NotFoundException(
        'User content ' + userContentId + " doesn't exist!",
      );
    }

    const oldVote = await this.voteService.getVote(userContentId, userId);
    if (oldVote) {
      // old vote exists
      const oldVoteName = oldVote.isPositive
        ? VOTE_OPTIONS.LIKE
        : VOTE_OPTIONS.DISLIKE;
      if (vote.vote == oldVoteName) return null;
      // remove the old vote
      await this.voteService.deleteVote(userContentId, userId);
      if (vote.vote == VOTE_OPTIONS.NONE) return null;
    }
    // set (new) vote
    const isPositive = vote.vote == VOTE_OPTIONS.LIKE;
    const createdVote = await this.voteService.createVote(
      userContentId,
      userId,
      isPositive,
    );
    return await this.userContentRequestService.getUserContent(
      createdVote.contentID,
      userId,
      false,
    );
  }

  /**
   * get the vote for one user-content-item for one user
   * @param userContentId
   * @param userId
   * @throws NotFoundException
   */
  async getUserVote(
    userContentId: string,
    userId: string,
  ): Promise<Vote | null> {
    if (
      !(await this.userContentService.getAuthorOfUserContent(userContentId))
    ) {
      throw new NotFoundException(
        'User content ' + userContentId + " doesn't exist!",
      );
    }
    return await this.voteService.getVote(userContentId, userId);
  }
}
