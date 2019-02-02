import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Artist } from '../models/artist';
import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { ArtistService } from '../services/artist.service';
import { AlbumService } from '../services/album.service';
import { Album } from '../models/album';

@Component({
  selector: 'album-add',
  templateUrl: '../views/album-add.html',
  providers : [ UserService, ArtistService, AlbumService ]
})
export class AlbumAddComponent implements OnInit{

  public pageTitle : string;
  public url : string;
  public identity;
  public token;
  public artist: Artist;
  public errorAlbum: string;
  public succesAlbum : string;
  public album : Album;

  constructor(
    private _route : ActivatedRoute,
    private _router : Router,
    private _userService: UserService,
    private _artistService : ArtistService,
    private _albumService : AlbumService
  ){
    this.pageTitle = 'Crear nuevo album';
    console.log('titulo',this.pageTitle);
    this.identity = _userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.album = new Album('','',2018,'','');
  }

  public ngOnInit(){
    console.log('componente de creacion de albumes cargado');
    this._route.params.forEach((param : Params) => {
      let artistId = param['artist'];
      this.album.artist = artistId;
    });
  }

  public onSubmit(){
    let self = this;
    this._albumService.addAlbum(this.token, this.album).subscribe(
      response => {
        if(response && response.album){
            self.succesAlbum = 'Album creado correctamente';
            self.album = response.album;
            this._router.navigate(['/editar-album',response.album._id]);
        }else{
          self.errorAlbum = 'Ocurrio un error creando el album';
        }
      },
      err => {
        let errorMessage = <any>err;
        if(errorMessage != null){
          self.errorAlbum = 'Error creando el album';
        }
      }
    );


  }

}
