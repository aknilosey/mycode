var mongoose=require('mongoose');
var bcrypt=require('bcrypt');
//var passportlocalmongoose=require("passport-local-mongoose");
var UserSchema =new mongoose.Schema({
    email:  {
      type:String,
      unique:true,
      required:true,
      trim:true
    },
    username: {
      type: String,
      unique:true,
      required:true,
      trim:true
    },
    password: {
      type:String,
      required:true
    },
    passwordConf: {
      type:String,
      required:true
    }
});
 // authentication for user
    UserSchema.statics.authenticate=function(email,password,callback){
    User.findOne({email:email}).exec(function(err,user){
        if (err) {
          console.log('Password error');
          return callback(err);
        }
        else if (!user) {
            var err=new Error('User not found');
            err.status=401;
            console.log('User not found');
            return callback(err);
        }
        bcrypt.compare(password,user.password, function(err,result) {
            if (result==true) {
              return callback(null,user);
            }
            else {
              return callback();
            }
        })

    });
};

// Salting

UserSchema.pre('save',function (next){
   var user=this;
   bcrypt.hash(user.password,10,function (err,hash){
       if(err) {
          return next(err);
       }
       user.password=hash;
       next();
   })
});
//UserSchema.plugin(passportlocalmongoose);
var User=mongoose.model('User',UserSchema);
module.exports=User;
