

const Joi = require('joi');

const signup_Validation = (req, res, next) => {
  const schema = Joi.object().keys({
    name: Joi.string().required(),
    gmail: Joi.string().email({ minDomainSegments: 2, tlds: { a: ['com', 'org', 'edu','in'] } }),
    password: Joi.string()
      .pattern(new RegExp('^[a-zA-Z0-9]{3,8}$')),
  });

  const { error } = schema.validate(req.body, { art: false });
  if (error) {
    const additionalText = "Please check your form and try again."; // Additional text
    res.render('index', { error: error.message ,additionalText})
  } else {
    next();
  }
};

const login_Validation = (req, res, next)=>{
    const schema =Joi.object().keys({
        gmail : Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com','org','edu'] } }),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,8}$')),
        repeat_password: Joi.ref('password')
    })
    const {error} = schema.validate(req.body,{ abortEarly :false});
    if(error){
        res.status(200).json({error:error})
    }else{
        next()
    }
} 

module.exports = {signup_Validation,login_Validation}