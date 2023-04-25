const mongoose = require('mongoose');
const app = require('./index');



async function connect(){
    try{
        await mongoose.connect("mongodb://0.0.0.0:27017/TwitterDB" , {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Connected to database");
    }catch(err){
        console.log('Error in connecting with mongo');
    } 
}

const PORT = 3000;
let appListen = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

connect();

module.exports = {connect , appListen};
// mongoose.connect("mongodb://0.0.0.0:27017/TwitterDB", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// }).then(() => {
//     console.log('Connected with mongodb');
//     const PORT = 3000;
//     app.listen(PORT, () => {
//         console.log(`Listening on port ${PORT}`);
//     })
// }).catch(err => {
//     console.log('Error in connecting with mongo');
// })


