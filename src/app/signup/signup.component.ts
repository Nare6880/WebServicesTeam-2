import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { DashboardComponent } from '../dashboard/dashboard.component';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent {
  fname: string = '';
  lname: string = '';
  uname: string = '';
  email: string = '';
  password: string = '';

  constructor(private auth: AuthService) {}

  setValue(fname: string, lname: string, email: string, password: string) {
    console.log('First name', fname, 'Last name', lname, 'Email', email);
  }

  signUp() {
    if(this.email == '') {
      alert('Please enter email');
      return;
    }

    if(this.password == '') {
      alert('Please enter password');
      return;
    }

    this.auth.signUp(this.email, this.password, this.uname);
    this.email = '';
    this.password = '';
  }
}

