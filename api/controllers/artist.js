'use strict'

var fs = require('fs');
var path = require('path');
var mongoosePaginate = require('mongoose-pagination');
var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getArtist(req, res){
  var artistId = req.params.id;
  Artist.findById(artistId, (err, artist)=>{
    if(err){
      res.status(500).send({
        message: 'Error consultando artista'
      });
    }else{
      if(artist){
        res.status(200).send({
          artist
        });
      }else{
        res.status(404).send({
          message: 'Artista no encontrado'
        });
      }
    }
  });
}

function getArtists(req, res){
  if(req.params.page){
    var page = req.params.page;
  }else{
    var page = 1;
  }
  var itemsPerPage = 4;
  Artist.find().sort('name').paginate(page, itemsPerPage, function(err, artists, total){
    if(err){
      res.status(500).send({
        message: 'Error consultando artistas'
      });
    }else{
      if(artists){
        return res.status(200).send({
          total_items: total,
          artists: artists
        });
      }else{
        res.status(404).send({
          message: 'no se encontraron artistas'
        });
      }
    }
  });
}

function updateArtist(req, res){
  var artistId = req.params.id;
  var update = req.body;

  Artist.findByIdAndUpdate(artistId, update, (err, updatedArtist) => {
    if(err){
      res.status(500).send({
        message: 'Error actualizando artistas'
      });
    }else{
      if(updatedArtist){
        res.status(200).send({
          artist: updatedArtist
        });
      }else{
        res.status(404).send({
          message: 'artista no actualizado'
        });
      }
    }
  });
}

function saveArtist(req, res){
  var artist = new Artist();
  var params = req.body;
  artist.name = params.name;
  artist.description = params.description;
  artist.image = 'null';
  artist.save((err, storedArtist) => {
    if(err){
      res.status(500).send({
        message: 'Error guardando artista'
      });
    }else{
      if(storedArtist){
        res.status(200).send({
          artist: storedArtist
        });
      }else{
        res.status(404).send({
          message: 'No se ha guardado el artista'
        });
      }
    }
  });
}

function deleteArtist(req, res){
  var artistId = req.params.id;
  Artist.findByIdAndRemove(artistId, (err, removedArtist)=>{
    if(err){
      res.status(500).send({
        message: 'Error eliminando artista'
      });
    }else{
      if(removedArtist){
        Album.find({artist: removedArtist._id}).remove((err,removedAlbum)=>{
          if(err){
            res.status(500).send({
              message: 'Error eliminando album'
            });
          }else{
            if(removedAlbum){
              Song.find({album: removedAlbum._id}).remove((err, removedSong)=>{
                if(err){
                  res.status(500).send({
                    message: 'Error eliminando cancion'
                  });
                }else{
                  if(removedSong){
                    res.status(200).send({
                      arist: removedArtist
                    });
                  }else{
                    res.status(404).send({
                      message: 'No se ha eliminado la cancion'
                    });
                  }
                }
              });
            }else{
              res.status(404).send({
                message: 'No se ha eliminado el album'
              });
            }
          }
        });
      }else{
        res.status(404).send({
          message: 'No se ha eliminado el artista'
        });
      }
    }
  });
}

function uploadImage(req, res){
  var artistId = req.params.id;
  var file_name = 'No subido...';
  if(req.files){
    var file_path = req.files.image.path;
    var file_split = file_path.split('\\');
    var file_name = file_split[(file_split.length-1)];
    var file_ext = file_name.split('\.')[(file_name.split('\.').length-1)];
    if(file_ext == 'png' || file_ext == 'jpg'
     || file_ext == 'jpeg' || file_ext == 'gif'){
       Artist.findByIdAndUpdate(artistId, {image: file_name}, (err, artistUpdated) =>
       {
         if(err){
           res.status(500).send({
             message : 'error actualizando artista'
           });
         }else{
           if(artistUpdated){
             res.status(200).send({
               artist : artistUpdated
             });
           }else{
             res.status(404).send({
               message : 'el artista no fue actualizado'
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
  var fullPath = './uploads/artists/'+imageFile;
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
  getArtist,
  saveArtist,
  getArtists,
  updateArtist,
  deleteArtist,
  uploadImage,
  getImageFile
};
