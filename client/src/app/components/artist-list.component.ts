import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../services/user.service';
import { GLOBAL } from '../services/global';
import { Artist } from '../models/artist';
import { ArtistService } from '../services/artist.service';

@Component({
  selector : 'artist-list',
  templateUrl: '../views/artist-list.html',
  providers: [ UserService, ArtistService ]
})

export class ArtistListComponent implements OnInit{

  public title: string;
  public artists: Artist[];
  public identity;
  public token;
  public url : string;
  public nextPage;
  public prevPage;
  public errorArtist;
  public confirmado;

  constructor(
    private _route : ActivatedRoute,
    private _router : Router,
    private _userService: UserService,
    private _artistService : ArtistService
  ){
    this.title = 'Artistas';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.nextPage = 1;
    this.prevPage = 1;
  }

  public ngOnInit(){
    console.log('componente de artistas cargado');
    this.getArtists();
  }

  public getArtists(){
    let self = this;
    this._route.params.forEach((params: Params) =>{
        let page = Number(params['page']);
        if(!page || page <= 0){
          page = 1;
        }else{
          this.nextPage = page + 1;
          this.prevPage = page - 1;
          if(this.prevPage <= 0 ){
            this.prevPage = 1;
          }
        }
        this._artistService.getArtists(this.token,page).subscribe(
          response => {
            if(response && response.artists){
              this.artists = response.artists;
              console.log(this.artists);
            }else{
              this._router.navigate(['/']);
            }
          },
          err => {
            let errorMessage = <any>err;
            if(errorMessage != null){
              self.errorArtist = 'Error recuperando los artistas';
            }
          }
        );
    });
  }

  public onDeleteConfirm(id){
      this.confirmado = id;
  }

  public onDeleteCancelArtist(){
    this.confirmado = null;
  }

  public onDeleteArtist(id){
    let self = this;
    this._artistService.deleteArtist(this.token,id).subscribe(
      response =>{
        if(!response || response.artist){
          self.errorArtist = 'Error borrando artista';
        }  this.getArtists();
      },
      err =>{
        let errorMessage = <any>err;
        if(errorMessage != null){
          self.errorArtist = 'Ha ocurrido un error borrando el artista';
        }
      }
    );
  }

  public makePythonCall() {
      this._artistService.makePythonCall().subscribe(
        response => {
          console.log('python response', response);
        },
        err => {
          console.log('error');
        }
      );
  }
}
