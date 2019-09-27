
const admin = require('firebase-admin');

class AuthMiddleWare{
    isEmailAndPasswordEmtpy(req, res, next){
        const {email, password} = req.body;
        if(email.trim() == '' || password == '') 
            return res.satus(400).send({message:'Invalid Email and Password'})
        next()
    }
    isEmailValid(req, res, next){
        const {email} = req.body;
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(!re.test(email.trim().toLowerCase()))
            return res.status(400).send({message:'Invalid Email Format'})
        next()
    }
    isPasswordEqualsConfirmPassword(req, res, next){
        const {password, confirmpassword} = req.body;
        if(password.trim().toLowerCase() !== confirmpassword)
            return res.status(400).send({message:'password and confirm password do not match'})
        next()
    }
    isPasswordLengthValid(req, res, next){
        const {password} = req.body;
        if(password.trim().length < 6)
            return res.status(400).send({message:'Password requires minimum of 6 characters'})
        next()
    }
    isAuthenticated(req, res, next) {
        if(req.headers && req.headers.authorization.startsWith('Bearer ')){
            const token = req.headers.authorization.split('Bearer ')[1];
            return admin.auth().verifyIdToken(token)
                .then(decodedToken => {
                    req.user = decodedToken
                    return admin.firestore().collection('users')
                            .where('userId','==', req.user.uid)
                            .limit(1)
                            .get()

                })
                .then(data => {
                    req.user.uid = data.docs[0].id
                    req.user.handle = data.docs[0].data().handle
                    next()
                })
                .catch(err => {
                    return res.status(403).send({
                        message: 'No authorization, error verifying token',
                        err
                    })
                })
        }
       return res.status(400).send({message:'No authorization'})
    }
}

module.exports = new AuthMiddleWare()
