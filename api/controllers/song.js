'use strict'

var fs = require('fs');
var path = require('path');
var mongoosePaginate = require('mongoose-pagination');
var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getSong(req, res){
  var songId = req.params.id;
  Song.findById(songId).populate({path:'album'}).exec((err, song) =>{
    if(err){
      res.status(500).send({
        message: 'Error consultando cancion'
      });
    }else{
      if(song){
        res.status(200).send({
          song
        });
      }else{
        res.status(404).send({
          message: 'Cancion no encontrada'
        });
      }
    }
  });
}

function saveSong(req, res){
  var song = new Song();
  var params = req.body;
  song.number = params.number;
  song.name = params.name;
  song.duration = params.duration;
  song.file = 'null';
  song.album = params.album;

  song.save((err, storedSong) => {
    if(err){
      res.status(500).send({
        message: 'Error guardando cancion'
      });
    }else{
      if(storedSong){
        res.status(200).send({
          song: storedSong
        });
      }else{
        res.status(404).send({
          message: 'Cancion no guardada'
        });
      }
    }
  });
}

function getSongs(req, res){
  var albumId = req.params.album;
  if(albumId){
    var find = Song.find({'album': albumId}).sort('number');
  }else{
    var find = Song.find({}).sort('number');
  }
  find.populate({path: 'album', populate: {path: 'artist'}}).exec((err, songs) => {
    if(err){
      res.status(500).send({
        message: 'Error consultando canciones'
      });
    }else{
      if(songs){
        res.status(200).send({
          songs
        });
      }else{
        res.status(404).send({
          message: 'Canciones no encontradas'
        });
      }
    }
  });
}

function updateSong(req, res){
  var songId = req.params.id;
  var update = req.body;

  Song.findByIdAndUpdate(songId, update, (err, updatedSong) => {
    if(err){
      res.status(500).send({
        message: 'Error actualizando cancion'
      });
    }else{
      if(updatedSong){
        res.status(200).send({
          song: updatedSong
        });
      }else{
        res.status(404).send({
          message: 'Cancion no actualizada'
        });
      }
    }
  });
}

function deleteSong(req, res){
  var songId = req.params.id;
  Song.findByIdAndRemove(songId, (err, removedSong) => {
    if(err){
      res.status(500).send({
        message: 'Error eliminando cancion'
      });
    }else{
      if(removedSong){
        res.status(200).send({
          song: removedSong
        });
      }else{
        res.status(404).send({
          message: 'cancion no actualizada'
        });
      }
    }
  });
}

function uploadFile(req, res){
  var songId = req.params.id;
  var file_name = 'No subido...';
  if(req.files){
    console.log(req.files);
    var file_path = req.files.songFile.path;
    var file_split = file_path.split('\\');
    var file_name = file_split[(file_split.length-1)];
    var file_ext = file_name.split('\.')[(file_name.split('\.').length-1)];
    if(file_ext == 'mp3' || file_ext == 'ogg'){
       Song.findByIdAndUpdate(songId, {file: file_name}, (err, songUpdated) =>
       {
         if(err){
           res.status(500).send({
             message : 'error actualizando la cancion'
           });
         }else{
           if(songUpdated){
             res.status(200).send({
               song : songUpdated
             });
           }else{
             res.status(404).send({
               message : 'la cancion no fue actualizada'
             });
           }
         }
       });
    }else{
      res.status(404).send({
        message : 'El archivo subido no es un archivo de audio'
      });
    }
  }else{
    res.status(404).send({
      message : 'La cancion no se ha subido'
    });
  }
}

function getSongFile(req, res){
  var file = req.params.songFile;
  var fullPath = './uploads/songs/'+file;
  fs.exists(fullPath, function(exists){
    if(exists){
      res.sendFile(path.resolve(fullPath));
    }else{
      res.status(404).send({
        message : 'La cancion no existe'
      });
    }
  });
}

module.exports = {
  getSong,
  saveSong,
  getSongs,
  updateSong,
  deleteSong,
  uploadFile,
  getSongFile
}
