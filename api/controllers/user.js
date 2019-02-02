'use strict'

var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var jwt = require('../services/jwt');

function pruebas(req, res){
  res.status(200).send({
    message: 'Testing user controller...'
  });
}


function saveUser(req, res){
  var user = new User();

  var params = req.body;

  user.name = params.name;
  user.surename = params.surename;
  user.email =params.email;
  user.role = 'ROLE_USER';
  user.image = 'null';
  if(params.password){
    if(user.name != null && user.surename !=null && user.email != null){
      bcrypt.hash(params.password, null, null, function(err, hash){
        if(err){
          res.status(500).send({
            message: 'Error al guardar usuario, intente nuevamente'
          });
        }else{
          user.password = hash;
          user.save((error, userStored) => {
            if(error){
              res.status(500).send({
                message: 'Error guardando usuario, intente nuevamente'
              });
            }else{
              if(!userStored){
                res.status(404).send({
                  message: 'No se ha registrado el usuario'
                });
              }else{
                res.status(200).send({
                  user: userStored
                });
              }
            }
          });
        }
      });
    }else{
      res.status(200).send({
        message: 'Introduce todos los campos'
      });
    }
  }else{
    res.status(200).send({
      message: 'la contraseña es requerida'
    });
  }
}


function loginUser(req, res){
  var params = req.body;
  if(params.password == null || params.email == null
    || params.password.trim() == '' || params.email.trim() == ''){
      res.status(500).send({
        message : 'usuario y password requeridos'
      });
  }
  var email = params.email;
  var password = params.password;

  User.findOne({email : email.toLowerCase()}, (err, user) =>{
    if(err){
      res.status(500).send({
        message : 'error consultando usuario'
      });
    }else{
      if(user){
        bcrypt.compare(password, user.password, function(err, check){
          if(err){
            res.status(500).send({
              message : 'error en login'
            });
          }else{
            if(check){
              if(params.gethash){
                res.status(200).send({token: jwt.createToken(user)});
              }else{
                res.status(200).send({user});
              }
            }else{
              res.status(202).send({
                message : 'No autorizado'
              });
            }
          }
        });
      }else{
        res.status(404).send({
          message : 'el usuario no existe'
        });
      }
    }
  });


}

function updateUser(req, res){
  var userId = req.params.id;
  var update = req.body;
  if(userId != req.user.sub){
    res.status(400).send({
      message : 'No autorizado'
    });
    return;
  }
  User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
    if(err){
      res.status(500).send({
        message : 'error actualizando usuario'
      });
    }else{
      if(userUpdated){
        res.status(200).send({
          user : userUpdated
        });
      }else{
        res.status(404).send({
          message : 'el usuario no fue actualizado'
        });
      }
    }
  });
}

function uploadImage(req, res){
  var userId = req.params.id;
  var file_name = 'No subido...';
  console.log('posting image...');

  if(req.files){
    var file_path = req.files.image.path;
    var file_split = file_path.split('\\');
    var file_name = file_split[(file_split.length-1)];
    var file_ext = file_name.split('\.')[(file_name.split('\.').length-1)];
    if(file_ext == 'png' || file_ext == 'jpg'
     || file_ext == 'jpeg' || file_ext == 'gif'){
       User.findByIdAndUpdate(userId, {image: file_name}, (err, userUpdated) =>
       {
         if(err){
           res.status(500).send({
             message : 'error actualizando usuario'
           });
         }else{
           if(userUpdated){
             res.status(200).send({
               user : userUpdated,
               image: file_name
             });
           }else{
             res.status(404).send({
               message : 'el usuario no fue actualizado'
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
  var fullPath = './uploads/users/'+imageFile;
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
  pruebas,
  saveUser,
  loginUser,
  updateUser,
  uploadImage,
  getImageFile
};
