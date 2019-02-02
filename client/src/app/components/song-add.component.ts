import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { SongService } from '../services/song.service';
import { Song } from '../models/song'

@Component({
  selector: 'song-add',
  templateUrl: '../views/song-add.html',
  providers : [ UserService, SongService ]
})
export class SongAddComponent implements OnInit{

  public pageTitle : string;
  public url : string;
  public identity;
  public token;
  public song : Song;
  public errorSong: string;
  public succesSong : string;
  public albumId: string;


  constructor(
    private _route : ActivatedRoute,
    private _router : Router,
    private _userService: UserService,
    private _songService: SongService
  ){
    this.pageTitle = 'Añadir canción';
    this.identity = _userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.song = new Song(0,'','','','');
  }

  public ngOnInit(){
    console.log('componente para agregar canciones cargado');
    this._route.params.forEach((param : Params) => {
      this.albumId = param['album'];
      this.song.album = this.albumId;
    });
  }

  public onSubmit(){
    let self = this;
    this._songService.addSong(this.token, this.song).subscribe(
      response => {
        if(response && response.song){
            self.succesSong = 'canción agregada correctamente';
            self.song = response.song;
            this._router.navigate(['/editar-tema',response.song._id]);
        }else{
          self.errorSong = 'Ocurrio un error agregando la canción';
        }
      },
      err => {
        let errorMessage = <any>err;
        if(errorMessage != null){
          self.errorSong = 'Error agregando la canción';
        }
      }
    );
  }

}
