import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { SongService } from '../services/song.service';
import { UploadService } from '../services/upload.service';
import { Song } from '../models/song'

@Component({
  selector: 'song-edit',
  templateUrl: '../views/song-add.html',
  providers : [ UserService, SongService, UploadService ]
})
export class SongEditComponent implements OnInit{

  public pageTitle : string;
  public url : string;
  public identity;
  public token;
  public song : Song;
  public errorSong: string;
  public succesSong : string;
  public songId: string;
  public isEdit: boolean;
  public filesToUpload: Array<File>;


  constructor(
    private _route : ActivatedRoute,
    private _router : Router,
    private _userService: UserService,
    private _songService: SongService,
    private _uploadService : UploadService
  ){
    this.pageTitle = 'Editar canción';
    this.identity = _userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.song = new Song(0,'','','','');
    this.isEdit = true;
  }

  public ngOnInit(){
    console.log('componente para edicion de canciones cargado');
    this._route.params.forEach((param : Params) => {
      this.songId = param['id'];
      this.getSong();
    });
  }

  public getSong(){
    let self = this;
      this._songService.getSong(this.token, this.songId).subscribe(
        response =>{
          if(response && response.song){
            this.song = response.song;
          }else{
            this._router.navigate(['/']);
          }
        },
        err => {
          let errorMessage = <any>err;
          if(errorMessage != null){
            self.errorSong = 'Error obteniendo la canción';
          }
        }
      );
  }

  public onSubmit(){
    let self = this;
    this._songService.editSong(this.token, this.song, this.songId).subscribe(
      response => {
        if(response && response.song){
            self.succesSong = 'canción editada correctamente';
            if(this.filesToUpload && this.filesToUpload.length>0){
                this._uploadService.makeFileRerquest(this.url+'upload-song-file/'+this.songId,
                                                    [],this.filesToUpload,this.token,'songFile').then(
                                                      (res) =>{
                                                        this._router.navigate(['/album', response.song.album]);
                                                      },
                                                      (err) =>{
                                                          self.errorSong = 'Error subiendo el archivo de audio';
                                                      }
                                                    );
            }else{
                this._router.navigate(['/album', response.song.album]);
            }
        }else{
          self.errorSong = 'Ocurrio un error editando la canción';
        }
      },
      err => {
        let errorMessage = <any>err;
        if(errorMessage != null){
          self.errorSong = 'Error editando la canción';
        }
      }
    );
  }

  public fileChangeEvent(fileInput: any){
    this.filesToUpload = <Array<File>> fileInput.target.files;
    console.log(this.filesToUpload);
  }

}
