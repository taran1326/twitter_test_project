const fetch = require('cross-fetch');
const { compareArrays } = require('./Commons');

async function testExplore() {

    try {
        let res = await fetch('http://localhost:4000/tweet/explore');

        res = await res.json();

        if(res.status !== 200 && res.status !== 201) {
            return false;
        }

        const result = compareArrays(Object.keys(res.data[0]), ['title', 'userId', 'bodyText']);

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
    const test1 = await testExplore();

    console.log(test1);

    return [test1];
}

tests();