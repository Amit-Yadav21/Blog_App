
const express=require('express')
const router=express.Router()

// here i require multer for file for upload image 
const uploaded = require('../multer/multerImage')
router.use('/image',express.static('Images'))

// here i require jwt for verifytoken 
const {verifyToken} = require('../jwt/jsonwebToken'); 

// here i require our all logice
const usercontroller=require('../controller/control')

// this is for signup validation and login validation 
const {signup_Validation,login_Validation} = require('../validation/validate');




// this router for create user 
router.get('/register',usercontroller.home)
router.post('/register',uploaded.product.single('image'),signup_Validation,usercontroller.createUser);

// this router for lgin user 
router.post('/login',login_Validation,usercontroller.loginUser);
router.get('/login',login_Validation,usercontroller.loginPage)

// router.get('/navbar', usercontroller.navbarPage);

// this router for get only login user data 
router.get('/readData',verifyToken,usercontroller.my_call)

// this router for get all data 
router.get('/readAllData',usercontroller.read_all_data )



// this router for update login user data
router.get('/updatedata',usercontroller.updatePage)
router.post('/updatedata',uploaded.product.single('image'),verifyToken,usercontroller.update)


// this router for delete login user date 
router.get('/deleteuserdata',verifyToken,usercontroller.deleteuserdata)

// this router for delete column data from table 
router.get('/deleteprofile/:column', verifyToken, usercontroller.deletedata);


// this router for delete all data 
router.delete('/deleteAllData',verifyToken,usercontroller.delete_all_data)

// this router for logout clear cookies
router.get('/logout',verifyToken,usercontroller.Logout);

// this router for image upload 
router.post('/uploadImageFile',uploaded.product.single('image'),verifyToken,usercontroller.uploadImageProfile);
router.get('/uploadImageFile',usercontroller.profileImage);

// this router for home page
router.get('/homepage',usercontroller.homepage)

// this router for create post 
router.get('/createPost',usercontroller.createPost)
router.post('createPost',uploaded.product.single('image'),verifyToken,usercontroller.createUserPost)

// Like a post
router.post('/posts/like', verifyToken, usercontroller.likePost);

// Dislike a post
router.post('/posts/dislike', verifyToken, usercontroller.dislikePost);

// this router for like and dislike 
router.get('/likedislike',usercontroller.likeDislike)
// =================

// this router for see all like and dislike 
router.get('/seelikeDislike',usercontroller.seeAll_like_dislike)

// this router for chat page 
// router.get('/chatpage',usercontroller.chatpage)
// router.get('/chatpage',usercontroller.chat)
module.exports=router;
