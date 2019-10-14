var mongoose = require('mongoose'),
    crypto = require('crypto');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: {
        type: String,
        unique: true,
        trim: true,
        required: 'Username is required'
    },
    password: {
        type: String,
        required: true,
        validate: [
            function (password) {
                return password && password.length == 8;
            },
            'Password must be at equal 8 characters'
        ],
    },
    salt: { // เใช้เพื่อนำไปทำ password hash
        type: String,
    },
    provider: { // Strategy ที่ ี user ลงทะเบียน
        type: String,
        required: 'Provider is required',
    },
    providerId: { // User id ที่ได้จาก provider
        type: String,
    },
    providerData: { // เก็บข้อมูลจาก OAuth provider

    },
    score: {
        type: [Number],
    },
    total: {
        type: Number,
        default: 0,
    },
    created:{
        type: Date,
        default: Date.now
    },
});

UserSchema.pre('save', function (next) {
    if(this.password){
        this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
        this.password = this.hashPassword(this.password);
    }
    next();
}); // ก่อน save ให้ทำอะไร เช่น hash password

UserSchema.methods.hashPassword = function (password) {
    return crypto.pbkdf2Sync(password, this.salt, 10000, 64, 'sha512').toString('base64');
    // Password-Based key Derivative Function 2
    // (password, salt, จำนวนการทำซ้ำ, จำวนวบิตของผลลัพธ์)
}; // method สำหรับ this.bah

UserSchema.methods.authenticate = function (password) {
    return this.password === this.hashPassword(password);
};

mongoose.model('User', UserSchema);