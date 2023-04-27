import { Component, Injectable, Input, OnInit } from '@angular/core';
import { MatchService } from '../service/match.service';
import {FormBuilder} from '@angular/forms';
import { AuthService } from '../auth.service';
import { ServerService } from '../server.service';

@Injectable()
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})

export class DashboardComponent implements OnInit {

  userName!: string;
  display!: string;
  matchData: any

  constructor(private userService: MatchService, private _formBuilder: FormBuilder, private auth: AuthService, private service: ServerService) {}

  options = this._formBuilder.group({
    bottom: 0,
    fixed: false,
    top: 0,
  });


  ngOnInit(): void {
    this.getDisplayName();
    this.getMatches();
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

  async getDisplayName() {
    this.userName = await this.service.getUserName();
    console.log(this.userName);
    return this.userName;
  }

  getMatches() {
    this.userService.getMatches().subscribe({
      next(data) {
        console.log('data', data);
      }, error(msg) {
        console.log('Error getting mathces: ', msg);
      }
    });
    
    this.userService.getMatches().subscribe((result: any) => {
      this.matchData = result;
      this.display = JSON.stringify(this.matchData);
      this.display = this.display.substring(1, this.display.length - 1)
    });
  }

  logout() {
    this.auth.logout();
  }
} 


