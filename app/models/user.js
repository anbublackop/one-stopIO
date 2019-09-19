import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userSchema = new Schema({
  Username: { type: String, trim: true },
  Password: { type: String, trim: true },
  FullName: { type: String, trim: true },
  Email: { type: String, trim: true },
  GoogleId: { type: String, trim: true },
});

const codeSchema = new Schema({
  UserId: String,
  Body: String,
  Language: String,
  Key: String,
  CreatedOn: Date,
  Link: String,
  SharedWith: Array
});

const User = mongoose.model('User', userSchema);
const Code = mongoose.model('Code', codeSchema);

export { User, Code }
