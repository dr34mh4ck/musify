import { Component, OnInit } from '@angular/core';
import { Song } from '../models/song';
import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';

@Component({
  selector : 'player',
  templateUrl : '../views/player.html',
  providers : [ UserService ]
})
export class PlayerComponent implements OnInit{

  public url : string;
  public song : Song;
  public identity;

  constructor(
    private _userService : UserService
  ){
    this.url = GLOBAL.url;
    this.identity = this._userService.getIdentity();
  }

  public ngOnInit(){
    console.log('componente player cargado');
    let song = JSON.parse(localStorage.getItem('sound_song'));
    if(song){
      this.song = song;
    }else{
      this.song = new Song(0,'','','','');
    }
  }
}
