'use strict'

var fs = require('fs');
var path = require('path');
var mongoosePaginate = require('mongoose-pagination');
var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getAlbum(req, res){
  var albumId = req.params.id;

  Album.findById(albumId).populate({path: 'artist'}).exec((err, album) => {
    if(err){
      console.log(err);
      res.status(500).send({
        message: 'Error consultando album'
      });
    }else{
      if(album){
        res.status(200).send({
          album
        });
      }else{
        res.status(404).send({
          message: 'Album no encontrado'
        });
      }
    }
  });
}

function saveAlbum(req, res){
  var album = new Album();
  var params = req.body;
  album.title = params.title;
  album.description = params.description;
  album.year = params.year;
  album.image = 'null';
  album.artist = params.artist;

  album.save((err, storedAlbum) => {
    if(err){
      res.status(500).send({
        message : 'Error guardando album'
      });
    }else{
      if(storedAlbum){
        res.status(200).send({
          album: storedAlbum
        });
      }else{
        res.status(404).send({
          message : 'Albun no guardado'
        });
      }
    }
  });

}

function getAlbums(req, res){
  var artistId = req.params.artist;
  if(artistId){
    var find = Album.find({artist: artistId}).sort('year')
  }else{
    var find = Album.find({}).sort('title');
  }
  find.populate({path: 'artist'}).exec((err, albums) =>{
    if(err){
      res.status(500).send({
        message: 'Error consultando albums'
      });
    }else{
      if(albums){
        res.status(200).send({
          albums
        });
      }else{
        res.status(404).send({
          message: 'Albums no encontrados'
        });
      }
    }
  });
}

function updateAlbum(req, res){
  var albumId = req.params.id;
  var update = req.body;
  Album.findByIdAndUpdate(albumId, update, (err, updatedAlbum) =>{
    if(err){
      res.status(500).send({
        message: 'Error actualizando album'
      });
    }else{
      if(updatedAlbum){
        res.status(200).send({
          album: updatedAlbum
        });
      }else{
        res.status(404).send({
          message: 'Album no actualizado'
        });
      }
    }
  });
}

function deleteAlbum(req, res){
    var albumId = req.params.id;

    Album.findByIdAndRemove(albumId, (err, removedAlbum) => {
      if(err){
        res.status(500).send({
          message: 'Error eliminando album'
        });
      }else{
        if(removedAlbum){
          Song.find({album: removedAlbum._id}).remove((err, removedSong) => {
            if(err){
              res.status(500).send({
                message: 'Error eliminando cancion'
              });
            }else{
              if(removedSong){
                res.status(200).send({
                  album: removedAlbum
                });
              }else{
                res.status(404).send({
                  message: 'cancion no eliminada'
                });
              }
            }
          });
        }else{
          res.status(404).send({
            message: 'Album no eliminado'
          });
        }
      }
    });

}

function uploadImage(req, res){
  var albumId = req.params.id;
  var file_name = 'No subido...';
  if(req.files){
    var file_path = req.files.image.path;
    var file_split = file_path.split('\\');
    var file_name = file_split[(file_split.length-1)];
    var file_ext = file_name.split('\.')[(file_name.split('\.').length-1)];
    if(file_ext == 'png' || file_ext == 'jpg'
     || file_ext == 'jpeg' || file_ext == 'gif'){
       Album.findByIdAndUpdate(albumId, {image: file_name}, (err, albumUpdated) =>
       {
         if(err){
           res.status(500).send({
             message : 'error actualizando album'
           });
         }else{
           if(albumUpdated){
             res.status(200).send({
               album : albumUpdated
             });
           }else{
             res.status(404).send({
               message : 'el album no fue actualizado'
             });
           }
         }
       });
    }else{
      res.status(404).send({
        message : 'El archivo subido no es una imagen'
      });
    }
  }else{
    res.status(404).send({
      message : 'La imagen no se ha subido'
    });
  }
}

function getImageFile(req, res){
  var imageFile = req.params.imageFile;
  var fullPath = './uploads/album/'+imageFile;
  fs.exists(fullPath, function(exists){
    if(exists){
      res.sendFile(path.resolve(fullPath));
    }else{
      res.status(404).send({
        message : 'La imagen no existe'
      });
    }
  });
}

module.exports = {
  getAlbum,
  saveAlbum,
  getAlbums,
  updateAlbum,
  deleteAlbum,
  uploadImage,
  getImageFile
};
