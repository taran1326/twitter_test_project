const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const tokenSchema = new Schema({
    userId:{
        type: Schema.Types.ObjectId,
        required : true
    },

    tokens:{
        type : String,
        required : true
    }
})


module.exports = mongoose.model('tb_tokens' , tokenSchema);



