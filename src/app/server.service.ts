import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { DashboardComponent } from './dashboard/dashboard.component';
import { user } from '@angular/fire/auth';
import { doc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class ServerService {

  constructor(private db: AngularFirestore) { }

  addPlayer(uuid: any, email: string, uname: string) {
    this.db.collection("Player").doc(uuid).set({email: email, Username: uname});
    console.log(uname, 'successfully added');
  }

  getUserName() {
    return new Promise<any>((resolve) => {
      this.db.collection('Player').valueChanges().subscribe(users => resolve(users));
    })
  }
}
