const querystring = require('querystring');


//parse decode

//console.log(querystring.parse("a=1 3 4 5&b=2"));//{ a: '1 3 4 5', b: '2' }
//console.log(querystring.parse("a=1+3+4+3#b=2",'#'));//{ a: '1 3 4 5', b: '2' }
//console.log(querystring.parse("a?1#b?2",'#','?'))//
//console.log(querystring.parse("a=1&b=2&a=3&a=4"));
//options.maxKeys



//encode stringify


console.log(querystring.stringify({a:2,b:3}));//a=2&b=3
console.log(querystring.stringify({a:{c:4,d:5},b:2}));//a=&b=2 哈哈哈 神经病
console.log(querystring.stringify({a:[1,2,3,4],b:2}));//a=1&a=2&a=3&a=4&b=2

