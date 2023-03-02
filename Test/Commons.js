function compareArrays(responseKeys, keys) {
    const res = keys.every((val) => {
        return responseKeys.indexOf(val) >= 0;
    });      
    return res;
}

module.exports = { compareArrays }