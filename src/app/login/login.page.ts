import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  user = {
    email: '',
    password: ''
  }

  constructor(private router: Router, public ngFireAuth: AngularFireAuth) { }

  ngOnInit() {
  }

  async logMeIn() {
    const user = await this.ngFireAuth.signInWithEmailAndPassword(this.user.email, this.user.password);

    console.log(user);

    if (user.user!.email) {
      this.router.navigate(['/home']);
    } else {
      alert('login failed!');
    }
  }

  async register() {
    try {
      const user = await this.ngFireAuth.createUserWithEmailAndPassword(this.user.email, this.user.password);
      console.log(user);
    } catch (error: any) {
      if (error instanceof Error) {
        for (const i in error) {
          console.log(i);
        }
      }
    }
  }

}
