
const Knex = require('knex')({
    client:'mysql',
    connection:{
        host:'localhost',
        user:'root',
        database:'Blog_app',
        password:'Amit@1234'
    }
});


const AllTable = function(){
    Knex.schema.createTable('student',(table)=>{
        table.increments('id').primary()
        table.string('name')
        table.string('gmail').unique()
        table.string('password').unique()
        table.string('profile').nullable()
    
    }).then((result) => {
        console.log('table created successfuly.....');
    }).catch((err) => {
        console.log('talble allready exist......');
    });


    
    Knex.schema.createTable('blogPosts',(table)=>{
        table.increments('id').primary()
        table.string('userId')
        table.string('titale').nullable()
        table.string('UserPost').nullable()
    
    })
    .then((result)=>{
        console.log('post table created successfully...');
    })
    .catch((err)=>{
        console.log('Post table already exist.....');
    })


    Knex.schema.createTable('LikeDislike', (table) => {
        table.increments('id').primary().notNullable();
        table.integer('userId').notNullable();
        table.integer('postid').notNullable(); // Updated column name to 'postid'
        table.boolean('Like');
        table.boolean('DisLike');
      })
      .then(() => {
        console.log('Table Created...');
      })
      .catch(() => {
        console.log('Table already exists....');
      });
      


}

AllTable()
module.exports=Knex