var moongoose = require ('mongoose'),
    Schema = moongoose.Schema,
    UserSchema = new Schema ({
        id : Number,
        username: String,
        password: String,
        salt: String,
        firstName: String,
        lastName: String,
        eMail: String
    });

module.exports = moongoose.model ('Users', UserSchema);