const express = require('express')
const router=express.Router()
const {verifyToken} = require('../jwt/jsonwebToken'); 
const multerFile = require('../multer/multerImage')
router.use('/image',express.static('Images'))
const routers = require('../controller/control')
const {signup_Validation,login_Validation} = require('../validation/validate');

router.get('/navbar', routers.navbarPage);

// this router for create user 
router.get('/register',routers.home)
router.post('/register',multerFile.product.single('image'),signup_Validation,routers.createUser);

// this router for lgin user 
router.post('/login',login_Validation,routers.loginUser);
router.get('/login',login_Validation,routers.loginPage)

// this router for get only login user data 
router.get('/readData',verifyToken,routers.my_call)

// this router for get all data 
router.get('/readAllData',routers.read_all_data )

// this router for update login user data
router.get('/updatedata',routers.updatePage)
router.post('/updatedata',multerFile.product.single('image'),verifyToken,routers.update)

// this router for delete login user date 
router.get('/deleteuserdata',verifyToken,routers.deleteuserdata)

// this router for delete column data from table 
router.get('/deleteprofile/:column', verifyToken, routers.deletedata);

// this router for delete all data 
router.delete('/deleteAllData',verifyToken,routers.delete_all_data)

// this router for logout clear cookies
router.get('/logout',verifyToken,routers.Logout);

// this router for image upload 
router.post('/uploadImageFile',multerFile.product.single('image'),verifyToken,routers.uploadImageProfile);
router.get('/uploadImageFile',routers.profileImage);

// this router for home page
router.get('/homepage',routers.homepage)

// this router for create post here
router.get('/createPost',routers.createPost)
router.post('createPost',multerFile.product.single('image'),verifyToken,routers.createUserPost)

// Like a post
router.post('/posts/like', verifyToken, routers.likePost);

// Dislike a post
router.post('/posts/dislike', verifyToken, routers.dislikePost);

// this router for like and dislike 
router.get('/likedislike',routers.likeDislike)

// this router for see all like and dislike 
router.get('/seelikeDislike',routers.seeAll_like_dislike)

module.exports=router;
