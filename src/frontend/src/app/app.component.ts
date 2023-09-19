import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {WeatherForecast, WeatherService} from "./weather.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  weatherForecast: Observable<WeatherForecast[]>|undefined;

  constructor(private weatherService: WeatherService) {
  }

  ngOnInit(): void {
    this.weatherForecast = this.weatherService.getWeatherForecast();
  }

}
