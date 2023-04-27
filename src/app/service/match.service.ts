import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Id } from '../interface/id';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class MatchService {


  constructor(private http: HttpClient) {}

  // getMatch(): Observable<Id[]> {
  //    return this.http.get<Id[]>('https://us-central1-webservices-2.cloudfunctions.net/api/getPlayer?id=0IGbFoVty4yM8uBPi06I');   
  // }

  addPlayer(id: string, userName: string) {
    let url = `https://us-central1-webservices-2.cloudfunctions.net/api/addPlayer?id=${id}&UserName=${userName}`;
  
    console.log('Called Success', id, userName);
    let res: Observable<any> = this.http.get(url, {responseType: 'text'});
    res.subscribe((result) => {
      console.log(result);
    });
  }

  getPlayer(id: string) {
    let url = `https://us-central1-webservices-2.cloudfunctions.net/api/getPlayer?id=${id}`;
  
    console.log('Call Success', id);
    let res: Observable<any> = this.http.get(url, {responseType: 'text'});
    res.subscribe((result) => {
      console.log(result);
    });
  }


  getMatches(): Observable<any> {
    return this.http.get<any>('https://us-central1-webservices-2.cloudfunctions.net/api/SimCurrent');   
  }
  // this.http.post<Id[]>(`https://us-central1-webservices-2.cloudfunctions.net/api/addPlayer?id=${id}&UserName=${userName}`, {id, userName});
}