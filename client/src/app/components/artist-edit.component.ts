import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ArtistService } from '../services/artist.service';
import { Artist } from '../models/artist';
import { UserService } from '../services/user.service';
import { UploadService } from '../services/upload.service';
import { GLOBAL } from '../services/global';

@Component({
  selector : 'artist-edit',
  templateUrl : '../views/artist-add.html',
  providers : [ ArtistService, UserService, UploadService ]
})
export class ArtistEditComponent implements OnInit{

  public title : string;
  public artist : Artist;
  public identity;
  public token;
  public url : string;
  public isEdit : boolean;
  public succesArtist: string;
  public errorArtist: string;
  public artistId;
  public filesToUpload : Array<File>;

  constructor(
    private _route : ActivatedRoute,
    private _router : Router,
    private _userService : UserService,
    private _artistService : ArtistService,
    private _uploadService : UploadService
  ){
    this.title = 'Editar artista';
    this.identity = _userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.isEdit = true;
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

  public onSubmit(){
    let self = this;
    this._artistService.editArtist(this.token, this.artistId, this.artist).subscribe(
      response =>{
        if(response && response.artist){
          this.succesArtist = 'Artista actualizado con exito';
          if(this.filesToUpload && this.filesToUpload.length>0){
              this._uploadService.makeFileRerquest(this.url+'upload-image-artist/'+this.artistId,
                                                  [],this.filesToUpload,this.token,'image').then(
                                                    (res) =>{
                                                      this._router.navigate(['/artista',response.artist._id]);
                                                    },
                                                    (err) =>{
                                                        self.errorArtist = 'Error subiendo imagen del artista';
                                                    }
                                                  );
          }else{
            this._router.navigate(['/artista',response.artist._id]);
          }
        }else{
          self.errorArtist = 'Ha ocurrido un error actualizando el artista';
        }
      },
      err => {
        let errorMessage = <any>err;
        if(errorMessage != null){
          self.errorArtist = 'Error actualizando el artista';
        }
      }
    );
  }

  public fileChangeEvent(fileInput: any){
      this.filesToUpload = <Array<File>>fileInput.target.files;
  }
}
