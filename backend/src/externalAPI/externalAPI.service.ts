import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { firstValueFrom } from "rxjs";

@Injectable()
export class ExternalAPIService {
  constructor(private readonly httpService: HttpService) {}

  async requestWolfram(prompt: string): Promise<string> {
    if(prompt === '') {
      return null;
    }

    const { data } = await firstValueFrom(
      this.httpService.get(process.env.WOLFRAM_APP_ID+encodeURIComponent(prompt)).pipe()
    );
    try{
      let imageBase64 = Buffer.from(data, 'binary').toString('base64');
      return imageBase64;
    }
    catch(error){
      console.log("Unable to convert response to base64\n\n"+error)
      return null;
    }
  }

  async requestGPT(prompt: string): Promise<string> {
    if(prompt === '') {
      return null
    }

    let body = {
      "prompt": prompt
    }

    let header = {
      "headers":{
        "Authorization": process.env.GPT_APP_TOKEN
      }
    }

    const { data } = await firstValueFrom(
      this.httpService.post(process.env.GPT_APP_URL, body, header).pipe()
    );

    if(data.output != null){
      return data.output
    }
    else{
      return null
    }
  }
}