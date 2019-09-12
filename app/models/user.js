import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userSchema = new Schema({
  Id: { type: Number, default: '_id' },
  Username: { type: String, trim: true },
  Password: { type: String, trim: true },
  FullName: { type: String, trim: true },
  Email: { type: String, trim: true },
  GoogleId: { type: String, trim: true },
});

const codeSchema = new Schema({
    Id: { type: Number, default: '_id' },
    UserId: Number,
    Body: String,
    Language: String,
    Key: String,
    CreatedOn: Date,
    Link: String,
    SharedWith: {
      Username: String,
      UserId: Number,
      SharedOn: Date
    }  
});

const User = mongoose.model('User', userSchema);
const Code = mongoose.model('Code', codeSchema);

module.exports.User = User;
module.exports.Code = Code;

