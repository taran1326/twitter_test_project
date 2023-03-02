const mongoose = require('mongoose');
const app = require('./index');

mongoose.connect("mongodb://0.0.0.0:27017/TwitterDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected with mongodb');
    const PORT = 3000;
    app.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`);
    })
}).catch(err => {
    console.log('Error in connecting with mongo');
})
