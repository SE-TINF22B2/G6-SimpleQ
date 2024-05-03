import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { AxiosResponse } from "axios";
import { Observable } from "rxjs";
import OpenAI from 'openai';

@Injectable()
export class ExternalAPIService {
  constructor(private readonly httpService: HttpService) {}

  requestWolfram(prompt: string): Observable<AxiosResponse<String>> {
    if(prompt === '') {
      return null
    }

    let question = decodeURIComponent(prompt);

    try {
      let output = this.httpService.get(process.env['WOLFRAM_APP_ID']+question);
      return output;
    }
    catch(error){
      console.log("cannot send wolfram alpha request\n"+error)
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
