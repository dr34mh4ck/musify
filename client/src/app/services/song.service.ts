import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import {GLOBAL} from './global';
import { Song } from '../models/song';

@Injectable()
export class SongService{

    public url: string;

    constructor(private _http:  Http){
      this.url = GLOBAL.url;
    }

    public getSong(token, songId: string){
      let headers = new Headers({
        'Authorization': token,
        'Content-Type' : 'application/json'
      });
      let options = new RequestOptions({headers:headers});
      return this._http.get(this.url+'song/'+songId,options)
                        .map(res => res.json());
    }

    public getSongs(token, albumId: string = null){
      let headers = new Headers({
        'Authorization': token,
        'Content-Type' : 'application/json'
      });
      let options = new RequestOptions({headers:headers});
      if(albumId == null){
        return this._http.get(this.url+'songs')
                          .map(res => res.json());
      }else{
        return this._http.get(this.url+'songs/'+albumId,options)
                          .map(res => res.json());
      }
    }

    public addSong(token, song: Song){
      let params = JSON.stringify(song);
      let headers = new Headers({
        'Authorization': token,
        'Content-Type' : 'application/json'
      });

      return this._http.post(this.url+'song',params,{headers:headers})
                        .map(res => res.json());
    }

    public editSong(token, song: Song, songId: string){
      let params = JSON.stringify(song);
      let headers = new Headers({
        'Authorization': token,
        'Content-Type' : 'application/json'
      });

      return this._http.put(this.url+'song/'+songId,params,{headers:headers})
                        .map(res => res.json());
    }


    public deleteSong(token, songId: string){
      let headers = new Headers({
        'Authorization': token,
        'Content-Type' : 'application/json'
      });
      let options = new RequestOptions({headers:headers});
      return this._http.delete(this.url+'song/'+songId,options)
                        .map(res => res.json());
    }
}
