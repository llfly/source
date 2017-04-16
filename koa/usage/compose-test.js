const Koa = require('koa');
const app = new Koa();
const compose = require('koa-compose');



const middleware = compose([function (ctx,next){
    console.log(111);
    console.log(arguments);
    next();
},function(ctx,next){
    console.log(2222);
    next();
},async function(){
    console.log(3333);
    await setTimeout(()=>console.log(4444),2000);
},/*generator function 不好用啊 白痴*/]);

app.use(middleware)

app.listen(8090);