import { Component, OnInit} from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { GLOBAL } from '../services/global';

@Component({
  selector : 'user-edit',
  templateUrl : '../views/user.edit.html',
  providers : [ UserService ]
})

export class UserEditComponent implements OnInit{

  public title : string;
  public user : User;
  public identity;
  public token;
  public errorupdate : string;
  public updateSuccess : string;
  public filesToUpload: Array<File>;
  public  url : string;



  public constructor(
    private _userService: UserService
  ){
    this.title = 'Actualizar mis datos';
    this.url = GLOBAL.url;
  }

  public ngOnInit(){
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.user = this.identity;
    console.log('componente edicion cargado');
  }


  public onUpdate(){
    let self = this;
    this._userService.updateUser(this.user).subscribe(
      response =>{
        if(!response.user){
          self.errorupdate = 'Ocurrio un error actualizando el usuario';
        }else{
          localStorage.setItem('identity',JSON.stringify(self.user));
          document.getElementById('identity_name').innerHTML = self.user.name;
          if(self.filesToUpload && self.filesToUpload.length > 0){
            this.makeFileRerquest(self.url+'upload-image-user/'+self.user._id,
                                  [],self.filesToUpload).then((res:any) =>{
                                      self.user.image = res.image;
                                      localStorage.setItem('identity',JSON.stringify(self.user));
                                      let pathImg = self.url+'get-user-image/'+self.user.image;
                                      document.getElementById('img_usr').setAttribute('src',pathImg);
                                      console.log(self.user);
                                      console.log(res);
                                  });
          }
          this.updateSuccess = 'El usuario ha sido actualizado correctamente';
        }
      },
      err =>{
        let errorMessage = <any>err;
        if(errorMessage != null){
          self.errorupdate = 'Ocurrio un error actualizando el usuario';
        }
      }
    );
  }


  public fileChangeEvent(fileInput: any){
      this.filesToUpload = <Array<File>>fileInput.target.files;
  }

  public makeFileRerquest(url:string, params:Array<string>, files: Array<File>){
    let token = this.token;
    return new Promise(function(resolve, reject){
       let formData : any = new  FormData();
       let xhr = new XMLHttpRequest();
       for(let i = 0; i< files.length; i++){
         formData.append('image', files[i], files[i].name);
       }
       xhr.onreadystatechange = function(){
         if(xhr.readyState == 4){
           if(xhr.status == 200){
             resolve(JSON.parse(xhr.response));
           }else{
             reject(xhr.response);
           }
       }}
       xhr.open('POST',url,true);
       xhr.setRequestHeader('Authorization',token);
       xhr.send(formData);
     });
  }


}
