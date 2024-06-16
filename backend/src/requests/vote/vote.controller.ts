import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  ValidationPipe,
} from '@nestjs/common';
import { VoteDto } from './dto/vote.dto';
import { VoteRequestService } from './vote-request.service';

@Controller('vote')
export class VoteController {
  constructor(private readonly voteRequestService: VoteRequestService) {}

  /**
   * Vote for a userContent, sending a type of Vote and the type of userContent
   * @param userContentId the userContentId
   * @param req
   * @param vote
   */
  @Post(':id')
  async voteForUserContent(
    @Param('id', new ParseUUIDPipe()) userContentId: string,
    @Req() req: any,
    @Body(new ValidationPipe()) vote: VoteDto,
  ) {
    return await this.voteRequestService.updateUserVote(
      vote,
      userContentId,
      req.userId,
    );
  }

  @Get(':id')
  async getVoteOfUserContent(
    @Param('id', new ParseUUIDPipe()) userContentId: string,
    @Req() req: any,
  ) {
    return await this.voteRequestService.getUserVote(userContentId, req.userId);
  }
}
