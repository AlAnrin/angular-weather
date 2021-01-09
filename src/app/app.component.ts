import {Component, HostListener} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {MoreInfoModalComponent} from './more-info-modal/more-info-modal.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  cities = [
    { code: 498817, name: 'Санкт-Петербург' },
    { code: 524894, name: 'Москва' },
    { code: 491422, name: 'Сочи' },
    { code: 2643741, name: 'Лондон' },
    { code: 2968815, name: 'Париж' },
    { code: 292223, name: 'Дубаи' },
    { code: 2673722, name: 'Стокгольм' }
  ];
  baseUrl = 'https://api.openweathermap.org/data/2.5/forecast';
  apiKey = '3bebdda89631980556d5ee2faeee2cce';

  allWeather: any = null;
  weather: any = null;

  active = 0;
  indexActiveDay = 0;
  activeDay: any = null;

  days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];

  public constructor(private modalService: NgbModal) {
    this.active = 498817;
    this.onNavChange(this.active);
  }

  onNavChange(nextId: number): void {
    this.getCityWeather(nextId).then(() => {
      this.changeDay(0);
    });
  }

  nextDay(): void {
    this.indexActiveDay++;
    this.changeDay(this.indexActiveDay);
  }

  lastDay(): void {
    this.indexActiveDay--;
    this.changeDay(this.indexActiveDay);
  }

  changeDay(newDay: number): void {
    this.indexActiveDay = newDay;
    this.activeDay = this.weather[this.indexActiveDay];
  }

  @HostListener('document:keydown', ['$event'])
  changeDayByKeyBoard(event: any): void {
    if (event.key === 'ArrowLeft' && this.indexActiveDay > 0)
      this.lastDay();
    if (event.key === 'ArrowRight' && this.indexActiveDay < 4)
      this.nextDay();
  }

  async getCityWeather(code: number): Promise<any> {
    const apiCall = await fetch(`${this.baseUrl}?id=${code}&units=metric&lang=ru&appid=${this.apiKey}`);
    const response = await apiCall.json();
    this.weather = null;
    this.allWeather = response.list;
    const list: any = [];
    let checkData: any = {};
    let nowCheckDate = '';
    let min: any = null; let feelMin: any = null;
    let max: any = null; let feelMax: any = null;
    let newWeather: any = null;
    response.list.forEach((item: any) => {
      const date = item.dt_txt.split(' ');
      if (date[0] !== nowCheckDate) {
        if (nowCheckDate !== '')
          list.push({
            dt: checkData.dt,
            dt_txt: checkData.dt_txt,
            min,
            feelMin,
            max,
            feelMax,
            weather: newWeather
          });
        nowCheckDate = date[0];
        min = null; feelMin = null;
        max = null; feelMax = null;
        newWeather = null;
      }

      min = min == null || item.main.temp < min ? item.main.temp : min;
      feelMin = feelMin == null || item.main.temp < feelMin ? item.main.temp : feelMin;

      max = max == null || item.main.temp > min ? item.main.temp : max;
      feelMax = feelMax == null || item.main.temp > feelMax ? item.main.temp : feelMax;

      if (date[1].split(':')[0] >= 12 && newWeather === null) {
        newWeather = item.weather[0];
      }

      checkData = item;
    });
    this.weather = list;
  }

  showDetail(): void {
    const modalRef = this.modalService.open(MoreInfoModalComponent);
    const list = this.allWeather.filter((item: any) => {
      return item.dt_txt.split(' ')[0] === this.activeDay.dt_txt.split(' ')[0];
    });
    modalRef.componentInstance.list = list;
  }

  cutDate(dtx: string): string {
    const date = new Date(dtx.split(' ').join('T'));
    const day = date.getDay();
    return `${dtx.split(' ')[0].split('-').reverse().join('.')} (${this.days[day]})`;
  }

  roundTemp(temp: number): number {
    temp = temp < 0 ? temp + 1 : temp - 1;
    return Math.round(temp);
  }
  floatTem(temp: number): number {
    temp = temp < 0 ? temp - 1 : temp + 1;
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
        return `assets/${main}.jpg`;
    }
    return 'assets/default.png';
  }
}
