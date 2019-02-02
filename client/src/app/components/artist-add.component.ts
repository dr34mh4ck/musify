import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Artist } from '../models/artist';
import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { ArtistService } from '../services/artist.service';

@Component({
  selector: 'artist-add',
  templateUrl: '../views/artist-add.html',
  providers : [ UserService, ArtistService]
})
export class ArtistAddComponent implements OnInit{

  public title : string;
  public url : string;
  public identity;
  public token;
  public artist: Artist;
  public errorArtist: string;
  public succesArtist : string;

  constructor(
    private _route : ActivatedRoute,
    private _router : Router,
    private _userService: UserService,
    private _artistService : ArtistService
  ){
    this.artist = new Artist('','','');
    this.title = 'Crear artista';
    this.identity = _userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
  }

  public ngOnInit(){
    console.log('componente agregar artista cargado');
  }

  public onSubmit(){
    let self = this;
    this._artistService.addArtist(this.token, this.artist).subscribe(
      response =>{
        if(response && response.artist){
          this.artist = response.artist;
          this.succesArtist = 'Artista creado con exito';
          this._router.navigate(['/editar-artista',response.artist._id]);
        }else{
          self.errorArtist = 'Ha ocurrido un error creando el artista';
        }
      },
      err => {
        let errorMessage = <any>err;
        if(errorMessage != null){
          self.errorArtist = 'Error creando el artista';
        }
      }
    );
  }

}
