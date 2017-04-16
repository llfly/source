
const Koa = require('koa');
const app = new Koa();

//console.log(app);
//{ subdomainOffset: 2, proxy: false, env: 'development' }


app.use(function(ctx,next){
    console.log(ctx);
    ctx.body = 'hello world';
});


/*
{
    request:{
        method,
        url,
        header:{
            host,
            connection,
            cache-control,
            upgrade-insecure-requests,
            user-agent,
            accept,
            accept-encoding,
            accept-language,
            cookie
        }
    }
    response: { status , message , header: {} },
    app: { subdomainOffset: 2, proxy: false, env: 'development' },
    originalUrl: '/',
    req: '<original node req>',
    res: '<original node res>',
    socket: '<original node socket>'
}
*/


app.listen(8090);