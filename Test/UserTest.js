const fetch = require('cross-fetch');
const { compareArrays } = require('./Commons');

async function testUser() {

    try {
        let res = await fetch('http://localhost:4000/user?username=ritik2022');

        res = await res.json();

        if(res.status !== 200 && res.status !== 201) {
            return false;
        }

        const result = compareArrays(Object.keys(res.data), ['user', 'tweets']);

        if(!result) 
            return false;

        return true;
    }
    catch(err) {
        console.log(err);
        return false;
    }
}

async function tests() {
    const test1 = await testUser();

    console.log(test1); 

    return [test1];
}

tests();