const knex = require('../DBconnection/connection');
const bcrypt = require('bcrypt');
const { createToken } = require('../jwt/jsonwebToken');

// ==================================================== Frontent page
// -------------------------- homePage
let home = (req, res) => {
  res.render('../FrontEnd/page/index.ejs', { error: null });
}
// ----------------------------- loginPage
let loginPage = (req, res) => {
  res.render('../FrontEnd/page/loginPage.ejs', { error: null }); // Pass the error as null initially

}
// ------------------------------------profileImage
let profileImage = (req, res) => {
  res.render('../FrontEnd/page/imageUpload.ejs', { error: null }); // Pass the error as null initially

}
// ----------------------------------- updatePage
let updatePage = (req, res) => {
  res.render('../FrontEnd/page/update.ejs', { error: null });
}
// ----------------------------------- createPostPage
const createPost = (req, res) => {
  res.render('../FrontEnd/page/createPost.ejs', { error: null });
}
// -------------------------------- homePage
const homepage = (req, res) => {
  res.render('../FrontEnd/page/homaPage.ejs', { error: null });

}
// ------------------------------------ likeDislink Page
const likeDislike = (req, res) => {
  res.render('../FrontEnd/page/like-dislike.ejs');
}


// ============================================== Backent 
// -------------------------------------------- signup user
const createUser = async (req, res, next) => {
  try {
    let { name, gmail, password } = req.body;
    const image = `http://localhost:4000/image/${req.file.filename}`;
    password = await bcrypt.hash(password, 10);
    let rows = await knex('student').select().where({ gmail });
    if (rows.length > 0) {
      res.send({ message: 'You are allready done signUp Please go and login', "This is your data": rows });
      next()
    }
    else {
      let d = await knex('student').insert({ name, gmail, password, profile: image });
      console.log({ message: "data created successfuly....", stauts: req.body, profile: image });
      res.send({ message: "data created successfuly....", stauts: req.body, profile: image })
      next()
    };
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ error: 'Internal server error' });
    next()
  }
}

// ----------------------------------------- login user
const loginUser = async (req, res) => {
  try {
    let { gmail, password } = req.body
    let data = await knex('student').where({ gmail });
    if (!data) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    let passwordMatch = await bcrypt.compare(password, data[0].password);
    let id = data[0].id   // here I got the id from the login user
    const token = await createToken(id) // generatetoken here  // here aniket is secret key
    // console.log('token',token);

    res.cookie('cookie', token);
    res.redirect('http://localhost:4000/readData')
    // res.send({'login user data': data,"token": token})

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
  }
  catch (error) {
    console.log(error);
    res.json({ message: "please first signUp", error: error.message });

  }
};

// ---------------this logice for create user post 
let uploadImageProfile = async (req, res, next) => {
  try {
    let userId = req.id__
    let titale = req.body.titale;
    const image = `http://localhost:4000/image/${req.file.filename}`;
    let d = await knex('blogPosts').insert({ userId, titale, UserPost: image });
    res.send({ message: "Post create successfully....", stauts: req.body, UserPost: image })
  } catch (error) {
    console.log(error);
    res.send(error)
  }
}

// ---------------------- see all Blog post 
const read_all_data = async (req, res, next) => {
  try {
    const posts = await knex.select().from('blogPosts');
    console.log('post', posts);
    res.render('../FrontEnd/page/AllBlog.ejs', { posts: posts });

  } catch (error) {
    console.log(error);
    res.send('Data not found...');
  }
};

// this logic for get all like and dislike 
const seeAll_like_dislike = async (req, res) => {
  try {
    const posts = await knex.select().from('LikeDislike')
    res.render('../FrontEnd/page/seelike-dislike.ejs', { posts: posts })
    console.log(posts);
  } catch (error) {
    console.log(error);

  }
}

const my_call = async (req, res, next) => {
  try {
    let id = req.id__;
    let rows = await knex('student').where({ id: id });
    let postData = await knex('blogPosts').where({ userId: id })
    if (rows.length > 0) {
      let data = postData.map(row => {
        let UserPost = [];
        if (row.UserPost) {
          try {
            UserPost = row.UserPost
          } catch (error) {
            console.error('Error parsing proifleImage:', error);
          }
        }
        return {
          ...row,
          UserPost: UserPost
        };
      })
      res.render('../FrontEnd/page/navbarPage.ejs', { data: rows, postdata: data });
    } else {
      res.status(401).json({ error: 'Please login first' });
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
    next();
  }
}

// -------------------------------------- upate
const update = async (req, res) => {
  try {
    const id = req.id__;
    let user = await knex('student').where({ id });
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    let { name, gmail, password } = req.body;
    const updateData = {}; // Empty object to store the fields to be updated

    if (name) {
      updateData.name = name; // Only update if name field is provided
    }
    if (gmail) {
      updateData.gmail = gmail; // Only update if gmail field is provided
    }
    if (password) {
      password = await bcrypt.hash(password, 10);
      updateData.password = password; // Only update if password field is provided
    }
    if (req.file) {
      const image = `http://localhost:4000/image/${req.file.filename}`;
      updateData.profile = image; // Only update if file is uploaded
    }
    const data = await knex('student').where({ id: id }).update(updateData);

    res.json({ "user id": id, 'update user data successfully': req.body });


  } catch (error) {
    console.log(error);
    res.json({ message: 'Please login first' });
  }
};

// here i am created logic for user post 
const createUserPost = (req, res) => {
  try {
    let id = req.id__
    console.log('id', id);

  } catch (error) {
    console.log(error.message);
    res.send(error)

  }
}

// ------------------------------------------delete login user data
const deleteuserdata = async (req, res) => {
  try {
    console.log('aniket tiwari');
    const id = req.id__ // find id with jwt logn user data
    console.log('================', id);
    let rows = await knex('student').where({ id: id });
    if (rows.length > 0) {
      const data = await knex('student').where({ id: id }).del(id)
      res.send({ info: 'data delete successfuly....', "this is your data": rows })
      console.log('+++++++++++++++++++++++', data);
    } else {
      res.send({ message: 'sorry data not found.....', info: 'login first' })
    }

  } catch (error) {
    console.log(error.message);
    res.send({ err: error, message: 'sorry data not found.....' })

  }
}

// ----------------------------------delete login user colomn data 
const deletedata = async (req, res) => {
  try {
    const id = req.id__;
    let rows = await knex('student').where({ id: id });

    if (rows.length > 0) {
      let columnName = req.params.column; // Column name from the route parameter
      console.log(columnName);

      if (columnName && rows[0].hasOwnProperty(columnName)) {
        const updateData = {};
        updateData[columnName] = null; // Set the column value to null to delete the data

        const condition = { id: id }; // Specify the condition to identify the row you want to update
        await knex('student').where(condition).update(updateData);

        res.send({ info: `Deleted ${columnName} successfully`, });


      } else {
        res.send({ message: 'Invalid column name or column not found' });
      }
    } else {
      res.send({ message: 'Sorry, data not found', info: 'Login first' });
    }
  } catch (error) {
    console.log(error.message);
    res.send({ err: error, message: 'Sorry, data not found' });
  }
};

// ----------------------------------------------delete all data
const delete_all_data = async (req, res) => {
  try {
    const data = await knex('student').truncate()
    res.send('all data deleted seccessfuly......')
  } catch (error) {
    console.log(error.message);
    res.send({ err: error, message: 'there is no data' })
  }
}

// ----------------------------------------logout
const Logout = async (req, res) => {
  try {
    let id = req.id__
    console.log(id, '============');
    let userdata = await knex('student').where({ id });
    if (userdata.length > 0) {
      res.clearCookie('cookie')
      res.send("logout succefully")

    } else {
      res.send('login first')
      res.redirect('http://localhost:4000/login')
    }

  } catch (error) {
    res.send('login first')
  }

}

// --------------------------------------- likePost
const likePost = async (req, res) => {
  try {
    const { postId } = req.body;
    console.log("postID", postId);
    const userId = req.id__; // Assuming you have stored the user ID in the authenticated user object
    console.log("userID", userId);
    const likes = await knex('LikeDislike').where({ userId, postid: postId }).select('Like');
    console.log('likes', likes);
    // const likes = await knex('LikeDislike').where({ userId, postId }).select('Like');

    if (likes.length > 0 && likes[0].Like) {
      return res.status(400).json({ error: 'Post already liked by the user' });
    }

    if (likes.length > 0 && !likes[0].Like) {
      await knex('LikeDislike').where({ userId, postId }).update({ Like: true, DisLike: false });
      return res.json({ message: 'Post liked successfully' });
    } else {
      await knex('LikeDislike').insert({ userId, postId, Like: true, DisLike: false });
      return res.json({ message: 'Post liked successfully' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// ------------------------------------------dislinkPost
const dislikePost = async (req, res) => {
  try {
    const { postId } = req.body;
    const userId = req.id__; // Assuming you have stored the user ID in the authenticated user object

    const dislikes = await knex('LikeDislike').where({ userId, postid: postId }).select('DisLike');
    // const likes = await knex('LikeDislike').where({ userId, postid: postId }).select('Like');


    if (dislikes.length > 0 && dislikes[0].DisLike) {
      return res.status(400).json({ error: 'Post already disliked by the user' });
    }

    if (dislikes.length > 0 && !dislikes[0].DisLike) {
      await knex('LikeDislike').where({ userId, postId }).update({ Like: false, DisLike: true });
      return res.json({ message: 'Post disliked successfully' });
    } else {
      await knex('LikeDislike').insert({ userId, postId, Like: false, DisLike: true });
      return res.json({ message: 'Post disliked successfully' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};


module.exports = { seeAll_like_dislike, likeDislike, likePost, dislikePost, uploadImageProfile, createUserPost, createPost, homepage, deleteuserdata, profileImage, updatePage, loginPage, my_call, home, createUser, read_all_data, update, deletedata, delete_all_data, loginUser, Logout };