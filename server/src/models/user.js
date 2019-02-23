var moongoose = require ('mongoose'),
    Schema = moongoose.Schema,
    UserSchema = new Schema ({
        id : Number,
        username: String,
        password: String,
        salt: String,
        firstName: String,
        lastName: String,
        eMail: String,
        active: Boolean,
        admin: Boolean,
        birthDate: Date,
        created : { type : Date, default : Date.now },
        updated : { type : Date, default : Date.now },
        phone: String,
        mobile: String
    });

module.exports = moongoose.model ('Users', UserSchema);