import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userSchema = new Schema({
  Id: Number,
  Username: String,
  Password: String,
  FullName: String,
  Email: String,
  GoogleId: String,
});

const codeSchema = new Schema({
    Id: Number,
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

// Id: Integer,
// 	->Full name: String,
// 	->Email: String,
// 	->Username: String,
// 	->Password: String,
// 	->Preferred language: String,
// 	->My Codes: Object {
// 				-> Id: Integer,
// 				-> UserId: Integer,
// 				-> Body: String,
// 				-> Language: String,
// 				-> Key: String,
// 				-> Created On: Date,
// 				-> Modified On: Date,
// 				-> Link: String,
// 				-> SharedWith: Object {
// 							-> UserId: Integer,
// 							-> Username: String,
// 							-> SharedOn: Date,
//    }
// }

export { User, Code };

