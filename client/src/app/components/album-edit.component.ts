import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Artist } from '../models/artist';
import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { AlbumService } from '../services/album.service';
import { UploadService } from '../services/upload.service';
import { Album } from '../models/album';

@Component({
  selector: 'album-edit',
  templateUrl: '../views/album-add.html',
  providers : [ UserService, AlbumService, UploadService ]
})
export class AlbumEditComponent implements OnInit{

  public pageTitle : string;
  public url : string;
  public identity;
  public token;
  public errorAlbum: string;
  public succesAlbum : string;
  public album : Album;
  public isEdit : boolean;
  public albumId: string;
  public filesToUpload : Array<File>;

  constructor(
    private _route : ActivatedRoute,
    private _router : Router,
    private _userService: UserService,
    private _albumService : AlbumService,
    private _uploadService : UploadService
  ){
    this.pageTitle = 'Editar album';
    this.identity = _userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.album = new Album('','',2018,'','');
    this.isEdit = true;
  }

  public ngOnInit(){
    console.log('componente de creacion de albumes cargado');
      this.getAlbum();
  }

  public getAlbum(){
    let self = this;
    this._route.params.forEach((param : Params) => {
      this.albumId = param['id'];
      this._albumService.getAlbum(this.token, this.albumId).subscribe(
        response => {
            if(response && response.album){
                this.album = response.album;
            }else{
                this._router.navigate(['/']);
            }
        },
        err => {
          let errorMessage = <any>err;
          if(errorMessage != null){
            self.errorAlbum = 'Error consultando el album';
          }
        }
      );
    });
  }

  public onSubmit(){
    let self = this;
    this._albumService.editAlbum(this.token, this.album,this.albumId).subscribe(
      response => {
        if(response && response.album){
            self.succesAlbum = 'Album modificado correctamente';
            if(this.filesToUpload && this.filesToUpload.length>0){
                this._uploadService.makeFileRerquest(this.url+'upload-image-album/'+this.albumId,
                                                    [],this.filesToUpload,this.token,'image').then(
                                                      (res) =>{
                                                        this._router.navigate(['/artista', response.album.artist]);
                                                      },
                                                      (err) =>{
                                                          self.errorAlbum = 'Error subiendo imagen del artista';
                                                      }
                                                    );
            }

        }else{
          self.errorAlbum = 'Ocurrio un error editando el album';
        }
      },
      err => {
        let errorMessage = <any>err;
        if(errorMessage != null){
          self.errorAlbum = 'Error editando el album';
        }
      }
    );
  }

  public fileChangeEvent(fileInput: any){
      this.filesToUpload = <Array<File>>fileInput.target.files;
  }

}
