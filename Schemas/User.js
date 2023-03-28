const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        // unique: true
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique:true

        // unique: true
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: false
    }
    // token:{
    //     type:String,
    //     required: false
    // }
})

module.exports = mongoose.model('tb_user', userSchema);



