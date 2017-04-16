var co = require('co');

co(function *(){
    console.log('first blood');

    //Promise
    yield Promise.resolve(console.log('double kill'));

    //generatorFunction
    yield function * (){
        console.log('triple kill');

        //function
        //yield function(){
        //    console.log('xxxx')
        //}

        yield [console.log(1),console.log(2)];

        //存在 function 后 后续不会执行 ？
        //yield function(){
        //    console.log('xxxxx');
        //};

        //yield co.wrap(function(){
        //    console.log('xxxx');
        //    return {
        //        value:undefined,
        //        done:false
        //    }
        //});

        yield {3:{
            5:console.log(5),
            6:console.log(6)
        },4:console.log(4)}
    };


    //yield console.log('triple kill');
});