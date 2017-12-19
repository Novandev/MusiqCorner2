
var mongoose = require('mongoose'),
    bcrypt = require('bcrypt'),
    Schema = mongoose.Schema;

var UserSchema = new Schema({
    createdAt       : { type: Date }
  , updatedAt       : { type: Date }

  , password        : { type: String, select: true }
  , username        : { type: String, required: true }
  , posts         : [{ type: Schema.Types.ObjectId, ref: 'Post' }]
});

UserSchema.pre('save', function(next){
  // SET createdAt AND updatedAt
  var now = new Date();
  this.updatedAt = now;
  if ( !this.createdAt ) {
    this.createdAt = now;
  }

  // ENCRYPT PASSWORD
  var user = this;
  if (!user.isModified('password')) {
    return next();
  }
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(user.password, salt, (err, hash) => {

      user.password = hash;
      next();
    });
  });
});


UserSchema.methods.comparePassword = (password, done)=> {
  bcrypt.compare(password, this.password, (err, isMatch)=> {
    done(err, isMatch);
  });
};
/*const autoPopulatePosts = function(next) {
  this.populate('username');
  next();
};
UserSchema.
  pre('find', autoPopulatePosts).
  pre('findOne', autoPopulatePosts); */
module.exports = mongoose.model('User', UserSchema);
