const express=require('express')
const app=express()
const port=4000
const path = require('path')
// const http = require('http').createServer(app)
const bodyParser = require('body-parser')
const router=require('./router/create_router')

app.use(express.json())
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use('/image', express.static('Images'));
app.use('/image', express.static(path.join(__dirname, 'Images')));
app.use('/',router)

// -------------------------------------------------- view html and css path on browser
const csspath = path.join(__dirname,"./FrontEnd/css")   // css file path 
const pages = path.join(__dirname,"./FrontEnd/page")    // html file path 
app.use(express.static(csspath))
app.set("pages",pages)

// app.get('/', (req, res) => {
//     res.render('like-dislike');
// });

app.listen(port,()=>{
    console.log(`this server is runing on ${port}`);
})

// ===============
// app.use(express.static(__dirname+"/public"))
