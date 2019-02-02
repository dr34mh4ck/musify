import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from './models/user';
import { UserService } from './services/user.service';
import { GLOBAL } from './services/global';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [ UserService ]
})
export class AppComponent implements OnInit {

  public title = 'Musify!';
  public user : User;
  public identity;
  public token;
  public errorLogin: string;
  public errorRegister: string;
  public registerSuccess:string;
  public userRegister: User;
  public url : string;

  constructor(
      private _route : ActivatedRoute,
      private _router : Router,
      private _userService : UserService
  ){
    this.user = new User('','','','','','ROLE_USER','');
    this.userRegister = new User('','','','','','ROLE_USER','');
    this.errorLogin = null;
    this.errorRegister = null;
    this.registerSuccess = null;
    this.url = GLOBAL.url;
  }

  ngOnInit(){
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  public onSubmit(){
    console.log(this.user);
    let self = this;
    this._userService.signup(this.user).subscribe(
      response => {
          self.errorLogin = response['message'];
          self.identity = response.user;
          if(self.identity && self.identity._id){
            console.log('logged in');
            localStorage.setItem('identity', JSON.stringify(this.identity));
                  this._userService.signup(this.user,'true').subscribe(
                    response => {
                        self.errorLogin = response['message'];
                        self.token = response.token;
                        if(this.token && this.token.length > 0){
                          localStorage.setItem('token', this.token);
                          console.log(this.token);
                          console.log(this.identity);
                        }else{
                          this.identity = null;
                          this.token = null;
                        }
                    },
                    err => {
                      let errorMessage = <any>err;
                      if(errorMessage != null){
                        self.errorLogin = JSON.parse(err['_body'])['message'];
                      }
                    }
                  );
          }else{
            this.identity = null;
          }
      },
      err => {
        let errorMessage = <any>err;
        if(errorMessage != null){
          self.errorLogin = JSON.parse(err['_body'])['message'];
        }
      }
    );
  }


  public logout(){
    localStorage.clear();
    this.identity = null;
    this.token = null;
    this._userService.identity = null;
    this._userService.token = null;
    this.user = new User('','','','','','ROLE_USER','');
    this._router.navigate(['/']); 
  }


  public onRegister(){
    console.log(this.userRegister);
    let self = this;
    this._userService.register(this.userRegister).subscribe(
      response =>{
          let user = response.user;
          if(!user._id){
              self.errorRegister = "Ocurrio un error registrando el usuario.";
          }else{
              self.registerSuccess = "Usuario registrado exitosamente! Identificate con el usuario "+user.email;
          }
          this.userRegister = new User('','','','','','ROLE_USER','');
      },
      err => {
        let errorMessage = <any>err;
        if(errorMessage != null){
          self.errorRegister = "Ocurrio un error registrando el usuario, intenta nuevamente.";
        }
      }
    );
  }

}
