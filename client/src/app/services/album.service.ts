import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import {GLOBAL} from './global';
import { Album } from '../models/album';

@Injectable()
export class AlbumService{

    public url: string;

    constructor(private _http:  Http){
      this.url = GLOBAL.url;
    }

    public getAlbum(token, id:string){
      let headers = new Headers({
        'Content-Type' : 'application/json',
        'Authorization' : token
      });
      let options = new RequestOptions({
        headers: headers
      });
      return this._http.get(this.url+'album/'+id, options)
                        .map(res => res.json());
    }

    public getAlbums(token, artistId: string){
      let headers = new Headers({
        'Content-Type' : 'application/json',
        'Authorization' : token
      });
      let options = new RequestOptions({
        headers: headers
      });
      if(!artistId){
        return this._http.get(this.url+'albums', options)
                          .map(res => res.json());
      }else{
        return this._http.get(this.url+'albums/'+artistId, options)
                          .map(res => res.json());
      }
    }

    public addAlbum(token, album: Album){
      let params = JSON.stringify(album);
      let headers = new Headers({
        'Authorization': token,
        'Content-Type' : 'application/json'
      });

      return this._http.post(this.url+'album',params,{headers:headers})
                        .map(res => res.json());
    }

    public editAlbum(token, album: Album, id: string){
      let params = JSON.stringify(album);
      let headers = new Headers({
        'Authorization': token,
        'Content-Type' : 'application/json'
      });

      return this._http.put(this.url+'album/'+id,params,{headers:headers})
                        .map(res => res.json());
    }

    public deleteAlbum(token, id:string){
      let headers = new Headers({
        'Content-Type' : 'application/json',
        'Authorization' : token
      });
      let options = new RequestOptions({
        headers: headers
      });
      return this._http.delete(this.url+'album/'+id, options)
                        .map(res => res.json());
    }
}
