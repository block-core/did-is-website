import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RegistrationService } from 'src/shared/registration.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register-component',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  private sub: any;

  identityInput: string | undefined;

  constructor(
    private route: ActivatedRoute,
    public reg: RegistrationService,
    public http: HttpClient
  ) {}

  ngOnInit() {
    this.sub = this.route.params.subscribe((params) => {});
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  lookupIdentity(identity: string) {
    
  }
}
