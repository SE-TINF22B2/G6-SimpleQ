import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import OpenAI from 'openai';
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

    let question = decodeURIComponent(prompt);

    const openai = new OpenAI({
      apiKey: process.env['GPT_APP_ID'],
    });

    try{
      const chatCompletion = await openai.chat.completions.create({
        messages: [{ role: 'user', content: question }],
        model: 'gpt-3.5-turbo',
      });
      return chatCompletion[0];
    }
    catch(error){
      console.log("cannot send AI request\n"+error)
      return null;
    }
  }
}
