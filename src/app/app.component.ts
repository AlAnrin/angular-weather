import { Component } from '@angular/core';
import {NgbNavChangeEvent} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  active = 0;
  cities = [
    { code: 498817, name: 'Санкт-Петербург' },
    { code: 2643741, name: 'Лондон' },
    { code: 524894, name: 'Москва' },
    { code: 2968815, name: 'Париж' },
    { code: 292223, name: 'Дубаи' },
    { code: 491422, name: 'Сочи' },
    { code: 2673722, name: 'Стокгольм' }
  ];
  baseUrl = 'https://api.openweathermap.org/data/2.5/forecast';
  apiKey = '3bebdda89631980556d5ee2faeee2cce';

  weather: any = null;

  days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];

  public constructor() {
    this.active = 498817;
    this.onNavChange(this.active);
  }

  onNavChange(nextId: number): void {
    this.getCityWeather(nextId).then(() => {
      console.log('change');
      console.log(this.weather);
    });
  }

  async getCityWeather(code: number): Promise<any> {
    const apiCall = await fetch(`${this.baseUrl}?id=${code}&units=metric&lang=ru&appid=${this.apiKey}`);
    const response = await apiCall.json();
    this.weather = null;
    const list: any = [];
    response.list.forEach((item: any) => {
      if (+item.dt_txt.split(' ')[1].split(':')[0] >= 12 &&
        !list.find((x: any) => x.dt_txt.split(' ')[0] === item.dt_txt.split(' ')[0])) {
        list.push(item);
      }
    });
    this.weather = list;
  }

  cutDate(dtx: string): string {
    const date = new Date(dtx.split(' ').join('T'));
    const day = date.getDay();
    return `${dtx.split(' ')[0].split('-').reverse().join('.')} (${this.days[day]})`;
  }

  roundTemp(temp: number): number {
    return Math.round(temp);
  }

  getImage(main: string): string {
    switch (main) {
      case 'Clouds':
      case 'Snow':
      case 'Rain':
      case 'Mist':
      case 'Clear':
      case 'Sun':
        return `../assets/${main}.jpg`;
    }
    return '../assets/default.png';
  }
}
