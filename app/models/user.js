import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userSchema = new Schema({
  Username: String,
  Password: String,
  FullName: String,
  Email: String,
  GoogleId: String,
  MyCodes: {
      UserId: Number,
      Body: String,
      Language: String,
      Key: String  
  }
});

const User = mongoose.model('User', userSchema);

export default User;
