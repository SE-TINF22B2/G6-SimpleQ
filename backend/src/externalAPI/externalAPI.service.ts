import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { firstValueFrom } from "rxjs";
import { UserContentService } from "../database/user-content/user-content.service";

@Injectable()
export class ExternalAPIService {
  constructor(private readonly httpService: HttpService, private readonly databaseService: UserContentService) {}


  private async checkParams(prompt: string, groupID: string): Promise<boolean> {
    if(prompt === '') {
      throw new Error("prompt is empty")
    } else if(await this.databaseService.checkGroupID(groupID)) {
      throw new Error("groupID does not exist")
    } else if(process.env.NODE_ENV === "dev"){
        return false
    } else if(process.env.WOLFRAM_APP_ID == undefined || process.env.GPT_APP_URL == undefined) {
        throw Error("ENV for AI is undefined")
    } else if(await this.databaseService.checkAIAnswerExists(groupID)) {
      throw Error("AI-generated Answer already exists with this groupID")
    } else {
      return true
    }
  }

  async requestWolfram(prompt: string, groupID: string): Promise<string> {
    try{
      let paramsCheck = await this.checkParams(prompt, groupID);
      if(paramsCheck) {
        const { data } = await firstValueFrom(
          this.httpService.get(process.env.WOLFRAM_APP_ID+encodeURIComponent(prompt)).pipe()
        );
        let imageBase64 = Buffer.from(data, 'binary').toString('base64');
        this.databaseService.createAnswer(null, groupID, data.output, "wolfram")
        return imageBase64;
      } else {
        return "Das ist eine automatisch generierte Antwort um Tokens zu sparen!"
      }
    }
    catch(error){
      throw error
    }
  }

  async requestGPT(prompt: string, groupID: string): Promise<string> {

    let body = {
      "prompt": prompt
    }

    let header = {
      "headers":{
        "Authorization": process.env.GPT_APP_TOKEN
      }
    }

    try{
      let paramsCheck = await this.checkParams(prompt, groupID);

      if(paramsCheck) {
        let gptURL = process.env.GPT_APP_URL != undefined ? process.env.GPT_APP_URL : "";
        const { data } = await firstValueFrom(
          this.httpService.post(gptURL, body, header).pipe()
        );
        if(data.output != null){
          this.databaseService.createAnswer(null, groupID, data.output, "gpt")
          return data.output
        }
        else{
          return "no output created"
        }
      }
      else{
        return "Das ist eine automatisch generierte Antwort um Tokens zu sparen!"
      }
    }
    catch(error) {
      throw error
    }
  }
}