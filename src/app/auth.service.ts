import { Injectable } from '@angular/core';
import { AngularFireAuth} from '@angular/fire/compat/auth'
import { Router } from '@angular/router';
import { MatchService } from './service/match.service';
import { ServerService } from './server.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private fireuth: AngularFireAuth,  private router: Router, private match: MatchService, private db: ServerService) { }

  //login
  login(email: string, password: string) {
    this.fireuth.signInWithEmailAndPassword(email, password).then( () => {
        localStorage.setItem('token', 'true');
        this.router.navigate(['dashboard']);
    }, err => {
        alert(err.message); 
        this.router.navigate(['']);
    } );
  }

  //Register
  signUp(email: string, password: string, username: string) {
    this.fireuth.createUserWithEmailAndPassword(email, password).then((userCredential) => {
      this.match.addPlayer(userCredential.user!.uid, username);
      this.db.addPlayer(userCredential.user!.uid, email, username);
      console.log(userCredential.user?.uid, username);
      alert('Registration Successful');
      this.router.navigate(['']);
    }, err => {
        alert(err.message); 
        this.router.navigate(['signup']);
    })
  }

  //log out
  logout() {
     this.fireuth.signOut().then( () => {
      localStorage.removeItem('token');
      this.router.navigate(['']);
     }, err => {
       alert(err.message);
     })
  }
}
