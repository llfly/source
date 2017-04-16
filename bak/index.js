var koa = require('koa');
var koaBody   = require('koa-body');

var app = koa();
app.use(koaBody({formidable:{uploadDir: __dirname}}));
app.name='test';
app.env='dev';
//app.proxy 如果为 true，则解析 "Host" 的 header 域，并支持 X-Forwarded-Host
//app.subdomainOffset //默认为2，表示 .subdomains 所忽略的字符偏移量

var request1=function(){
    return new Promise(function(resolve,reject){
        setTimeout(function(){
            resolve('第一次请求');
        },500);
    })
};

var request2=function(){
    return new Promise(function(resolve,reject){
        setTimeout(function(){
            resolve('第二次请求');
        },500);
    })
};

//before
app.use(function *(next){
    var start = new Date;
    var res=yield request1();
    this.body=res;
    yield next;
    var ms = new Date - start;
    console.log('before',ms);

});

//context
app.use(function *(next){
    //console.log(Object.keys(this.res))
    this.body='abc';
});

//after
app.use(function *(next){
    var res=yield request2();
    this.body +=res;
    yield next;
    console.log('after');
});

app.listen(3001);