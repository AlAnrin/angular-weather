import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-more-info-modal',
  templateUrl: './more-info-modal.component.html',
  styleUrls: ['./more-info-modal.component.scss']
})
export class MoreInfoModalComponent implements OnInit {
  @Input() list: any;
  degWind = ['с', 'с-в', 'в', 'ю-в', 'ю', 'ю-з', 'з', 'с-з', 'с'];
  iconUrl = 'https://openweathermap.org/img/w/';

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  round(temp: number): number {
    return Math.round(temp);
  }
}
