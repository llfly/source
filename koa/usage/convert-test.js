const Koa = require('koa');
const convert = require('koa-convert');
const app = new Koa();


function * legacyMiddleware (next) {
    console.log('enter',arguments);//{ '0': {} }
    yield next;
    console.log('again');
}


//app.use(modernMiddleware);

app.use(convert(legacyMiddleware))

//app.use(convert.compose(legacyMiddleware, modernMiddleware));



app.use((ctx,next)=>{
    console.log('end');
    ctx.body = 'hello world';
})



//function modernMiddleware (ctx, next) {
//    // before
//    return next().then(() => {
//        // after
//    })
//}



app.listen(8090);