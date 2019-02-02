import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Album } from '../models/album';
import { Song } from '../models/song';
import { UserService } from '../services/user.service';
import { UploadService } from '../services/upload.service';
import { AlbumService } from '../services/album.service';
import { SongService } from '../services/song.service';
import { GLOBAL } from '../services/global';

@Component({
  selector : 'album-detail',
  templateUrl : '../views/album-detail.html',
  providers : [ UserService, AlbumService, SongService ]
})
export class AlbumDetailComponent implements OnInit{

  public album: Album;
  public identity;
  public token;
  public url : string;
  public succesAlbum: string;
  public errorAlbum: string;
  public songs : Song[];
  public confirmado : string;


  constructor(
    private _route : ActivatedRoute,
    private _router : Router,
    private _userService : UserService,
    private _albumService : AlbumService,
    private _songService: SongService
  ){
    this.identity = _userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.album = new Album('','',0,'','');
  }

  public ngOnInit(){
    console.log('componente de detalle de album cargado');
    this.getAlbum();
  }

  public getAlbum(){
    let self = this;
    this._route.params.forEach((params: Params) =>{
       let id = params['id'];

       this._albumService.getAlbum(this.token, id).subscribe(
         response =>{
           if(response && response.album){
             this.album = response.album;
             this._songService.getSongs(this.token, response.album._id).subscribe(
               result => {
                 if(result && result.songs){
                   this.songs = result.songs;
                 }else{
                  self.errorAlbum = 'El album no tiene canciones';
                 }
               },
               error => {
                  self.errorAlbum = 'Error consultando las canciones del album';
               }
             );
           }else{
              this._router.navigate(['/']);
           }
         },
         err =>{
          self.errorAlbum = 'Error consultando el artista';
          console.log(err);
         }
       );
    });
  }


  public onDeleteConfirm(songId){
    this.confirmado = songId;
  }

  public onCancelSong(){
    this.confirmado = null;
  }

  public onDeleteSong(songId){
    let self = this;
    this._songService.deleteSong(this.token, songId).subscribe(
      response => {
        if(response && response.song){
            self.succesAlbum = 'canción eliminada exitosamente';
            this.getAlbum();
        }else{
          self.errorAlbum = 'Error eliminando canción';
        }
      },
      err => {
        self.errorAlbum = 'Error eliminando canción';
        console.log(err);
      }
    );
  }


  public startPlayer(song){
    let songPlayer = JSON.stringify(song);
    let filePath = this.url + 'get-song-file/' + song.file;
    let imagePath = this.url + 'get-album-image/' + song.album.image;
    localStorage.setItem('sound_song',songPlayer);
    document.getElementById('mp3-source').setAttribute('src',filePath);
    (document.getElementById('player') as any).load();
    (document.getElementById('player') as any).play();
    document.getElementById('play-song-title').innerHTML = song.name;
    document.getElementById('play-song-artist').innerHTML = song.album.artist.name;
    document.getElementById('play-image-album').setAttribute('src',imagePath);
  }

}
