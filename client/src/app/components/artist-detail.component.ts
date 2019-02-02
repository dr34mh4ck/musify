import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ArtistService } from '../services/artist.service';
import { Artist } from '../models/artist';
import { Album } from '../models/album';
import { UserService } from '../services/user.service';
import { UploadService } from '../services/upload.service';
import { AlbumService } from '../services/album.service';
import { GLOBAL } from '../services/global';

@Component({
  selector : 'artist-detail',
  templateUrl : '../views/artist-detail.html',
  providers : [ ArtistService, UserService, AlbumService ]
})
export class ArtistDetailComponent implements OnInit{

  public artist : Artist;
  public identity;
  public token;
  public url : string;
  public succesArtist: string;
  public errorArtist: string;
  public artistId;
  public albums: Album[];
  public confirmado;

  constructor(
    private _route : ActivatedRoute,
    private _router : Router,
    private _userService : UserService,
    private _artistService : ArtistService,
    private _albumService : AlbumService
  ){
    this.identity = _userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.artist = this.artist = new Artist('','','');
  }

  public ngOnInit(){
    console.log('componente de edicion de artistas cargado');
    this.getArtist();
  }

  public getArtist(){
    let self = this;
    this._route.params.forEach((params: Params) =>{
       self.artistId = params['id'];

       this._artistService.getArtist(this.token, self.artistId).subscribe(
         response =>{
           if(response && response.artist){
             this.artist = response.artist;
             this._albumService.getAlbums(this.token, response.artist._id).subscribe(
               result => {
                 if(result && result.albums){
                   this.albums = result.albums;
                   console.log(this.albums);
                 }else{
                   self.errorArtist = 'El artista no tiene albums';
                 }
               },
               error =>{
                    self.errorArtist = 'Error consultando albums del artista';
               }
             );
           }else{
              this._router.navigate(['/']);
           }
         },
         err =>{
          self.errorArtist = 'Error consultando el artista';
          console.log(err);
         }
       );
    });
  }

  public onDeleteConfirm(id ){
    this.confirmado = id;
  }

  public onDeleteAlbum(id){
    let self = this;
    this._albumService.deleteAlbum(this.token, id).subscribe(
      response => {
        if(response && response.album){
          this.getArtist();
          self.succesArtist = 'Album borrado exitosamente'
        }else{
            self.errorArtist = 'Error borrando el album';
        }
      },
      err => {
        self.errorArtist = 'Error borrando el album';
        console.log(err);
      }
    );
  }

  public onDeleteCancelAlbum(){
    this.confirmado = null;
  }

}
