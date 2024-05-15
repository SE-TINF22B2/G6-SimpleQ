import {BadGatewayException, Controller, Get, NotFoundException, Param, ParseUUIDPipe, Put} from '@nestjs/common';
import {UserService} from "../../database/user/user.service";
import {ExpertService} from "../../database/expert/expert.service";

enum Registration{      // TODO extract
    registered = "registered",
    proUser = "proUser"
}

@Controller('profile')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly expertService: ExpertService
    ) {}

    @Get(":id")
    async getBasicProfile(@Param("id", new ParseUUIDPipe()) id: string){
        const usrProfile = await this.userService.getUser(id);
        const expertTags = await this.expertService.getExpertTagsForUser(id);

        if(usrProfile === null || expertTags === null){
            throw new NotFoundException("User does not exist");
        }
        const accountState:Registration = usrProfile.isPro?Registration.proUser:Registration.registered;
        const expertTagList: string[] = expertTags.map(e => e.tagname)

        return {
            "name": usrProfile.username,
            "profilePicture": null,
            "registrationDate": usrProfile.timeOfRegistration,
            "accountState": accountState.toString(),
            "expertTopics": expertTagList
        }
    }

    @Get(":id/profile")
    async getDetailedProfile(@Param("id", new ParseUUIDPipe()) id: string){
        const usrProfile = await this.userService.getUser(id);
        const expertTags = await this.expertService.getExpertTagsForUser(id);

        if(usrProfile === null || expertTags === null){
            throw new NotFoundException("User does not exist");
        }
        const accountState = usrProfile.isPro?Registration.proUser:Registration.registered;

        return {
            "name": usrProfile.username,
            "profilePicture": null,
            "registrationDate": usrProfile.timeOfRegistration,
            "accountState": accountState.toString(),
            "expertTopics": expertTags,
            "userStatistics": {
                "TODO": null
            },
            "activityPoints": usrProfile.activityPoints
        }
    }

    @Put("update")
    updateProfile(){
        return "not implemented"
    }

    @Get("login/attemps")
    getLoginAttempts(){
        return "not implemented"
    }
}
