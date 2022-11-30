import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  index = 0;

  background = 'splash0';

  constructor() {
    setInterval(() => {

      this.index++;

      if (this.index > 4) {
        this.index = 0;
      }

      this.background = 'splash' + this.index;

    }, 2200);
  }
}
