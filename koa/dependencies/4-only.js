
const only = (obj, keys) => {
    obj = obj || {};
    if ('string' == typeof keys) keys = keys.split(/ +/);   //string to Array split ' '
    return keys.reduce(function(ret, key){//first time ret : {}  iteration add attribute
        if (null == obj[key]) return ret;
        ret[key] = obj[key];
        return ret;
    }, {});
};


// Array  reduce function
// array.reduce(callback[, initialValue])
var sum = [1, 2, 3, 4].reduce((previous, current, index, array) => {
    console.log(index,":",previous,current,array);
    //0 ':' 0 1 [ 1, 2, 3, 4 ]
    //1 ':' 1 2 [ 1, 2, 3, 4 ]
    //2 ':' 3 3 [ 1, 2, 3, 4 ]
    //3 ':' 6 4 [ 1, 2, 3, 4 ]
    //10
    return previous + current
},0);

console.log(sum);







//only function test

/*
console.log(only({
    a:1,
    b:2,
    c:3
},'a b'));//a,b



*/


module.exports = only;