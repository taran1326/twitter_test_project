const mongoose = require('mongoose');
const app = require('./index');


async function connect(){
    try{
        await mongoose.connect("mongodb://0.0.0.0:27017/TwitterDB" , {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Connected to database");
        const PORT = 3000;
        app.listen(PORT, () => {
            console.log(`Listening on port ${PORT}`);
        });
    }catch(err){
        console.log('Error in connecting with mongo');
    }
}

connect();


module.exports = {connect};
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


