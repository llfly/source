//const Koa = require('koa');
//const app = new Koa();
//const compose = require('koa-compose');
//
//
//
//const middleware = compose([function (ctx,next){
//    console.log(111);
//    console.log(arguments);
//    next();
//},function(ctx,next){
//    console.log(2222);
//    next();
//},async function(){
//    console.log(3333);
//    await setTimeout(()=>console.log(4444),2000);
//},/*generator function 不好用啊 白痴*/]);
//
//app.use(middleware)
//
//app.listen(8090);






const compose = require('koa-compose');

const middleware = compose([function(ctx,next){
    console.log(1111);
    console.log(arguments);
    next();
    console.log(4444);
},function(ctx,next){
    console.log(2222);
    next();
    console.log(5555);
},async function(){
    console.log(3333);
    await setTimeout(() =>console.log(6666),2000);
    console.log(123123);
}])


//事实上，洋葱是通过compose实现的
//1111
//{ '0': undefined, '1': [Function: next] }
//2222
//3333
//5555
//4444
//123123
//6666




middleware();