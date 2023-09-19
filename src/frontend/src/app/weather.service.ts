import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  constructor(private httpClient: HttpClient) { }

  getWeatherForecast(): Observable<WeatherForecast[]> {
    return this.httpClient.get<WeatherForecast[]>('/api')
  }
}


export interface WeatherForecast{
   date: Date;
   temperatureC:number;
   temperatureF: number;
   summary: string;
}
