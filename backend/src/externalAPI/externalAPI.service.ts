import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { AxiosResponse } from "axios";
import { Observable } from "rxjs";

@Injectable()
export class ExternalAPIService {
  constructor(private readonly httpService: HttpService) {}

  requestWolfram(prompt: String): Observable<AxiosResponse<String>> {
    return this.httpService.get('');
  }

  requestGPT(prompt: String): Observable<AxiosResponse<String>> {
    return this.httpService.get('');
  }
}
