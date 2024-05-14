import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { firstValueFrom } from "rxjs";
import { UserContentService } from "src/database/user-content/user-content.service";

@Injectable()
export class ExternalAPIService {
  constructor(private readonly httpService: HttpService, private readonly databaseService: UserContentService) {}

  async requestWolfram(prompt: string, groupID: string): Promise<string> {
    if(prompt === '' || groupID === '') {
      return "";
    }

    if(process.env.NODE_ENV === "dev"){
      return new Promise((resolve, rejects) => {
        resolve("Das ist nur eine default Antwort um Tokens zu sparen.")
      })
    }

    if(process.env.WOLFRAM_APP_ID == undefined) {
      throw Error("ENV WOLFRAM_APP_ID is undefined")
    }

    const { data } = await firstValueFrom(
      this.httpService.get(process.env.WOLFRAM_APP_ID+encodeURIComponent(prompt)).pipe()
    );
    try{
      let imageBase64 = Buffer.from(data, 'binary').toString('base64');
      this.databaseService.createAnswer(null, groupID, data.output, "GPT")
      return imageBase64;
    }
    catch(error){
      console.log("Unable to convert response to base64\n\n"+error)
      return "";
    }
  }

  async requestGPT(prompt: string, groupID: string): Promise<string> {
    if(prompt === '' || groupID === '') {
      return ""
    }

    if(process.env.NODE_ENV === "dev"){
      return new Promise((resolve, rejects) => {
        resolve("Das ist nur eine default Antwort um Tokens zu sparen.")
      })
    }

    let body = {
      "prompt": prompt
    }

    let header = {
      "headers":{
        "Authorization": process.env.GPT_APP_TOKEN
      }
    }

    if(process.env.GPT_APP_URL == undefined){
      throw Error("ENV GPT_APP_URL is undefined");
    }
    const { data } = await firstValueFrom(
      this.httpService.post(process.env.GPT_APP_URL, body, header).pipe()
    );

    if(data.output != null){
      this.databaseService.createAnswer(null, groupID, data.output, "GPT")
      return data.output
    }
    else{
      return ""
    }
  }
}