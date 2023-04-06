import { Component, Injectable, Input, OnInit } from '@angular/core';
import { MatchService } from '../service/match.service';
import { Id } from '../interface/id';
import {FormBuilder} from '@angular/forms';
import { AuthService } from '../auth.service';
import { idToken, user } from '@angular/fire/auth';
import { SignupComponent } from '../signup/signup.component';

@Injectable()
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {


  userName!: string;

  constructor(private userService: MatchService, private _formBuilder: FormBuilder, private auth: AuthService) {}

  options = this._formBuilder.group({
    bottom: 0,
    fixed: false,
    top: 0,
  });


  ngOnInit(): void {
    this.onGetUsers();
  }

  onGetUsers(): void{
    // this.userService.getMatch().subscribe({
    //   next(data) {
    //     console.log('data: ', data);
    //   }, error(msg) {
    //     console.log('Error getting players: ', msg);
    //   }
    // });
    // this.userService.getMatch().subscribe((id: any) => {
    //   this.users = id;
    // });
  }

  logout() {
    this.auth.logout();
  }
} 


