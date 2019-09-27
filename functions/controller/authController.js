const firebase = require('firebase')
const admin = require('firebase-admin');
const db = admin.firestore();

class UserController {
    login(req, res) {
        const { email, password } = req.body;
        console.log(email, password)
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(data => {
                return data.user.getIdToken(true)
            })
            .then(token => {
                return res.status(200).send({
                    message: 'Login Successful',
                    token
                })
            })
            .catch(err => {
                if (err.code = 'auth/wrong-password')
                    return res.status(403).send({ message: 'wrong email or password' })
                return res.status(404).send({ message: 'some errors encountered', err })
            })
    }
    signup(req, res) {
        const { email, password, confirmpassword, handle } = req.body
        const newUser = { email, password, confirmpassword, handle }
        db.doc(`/users/${email}`)
            .get().then(doc => {
                if (doc.exists) {
                    return res.status(400)
                        .send({
                            handle: `this handle is already taken`
                        })
                }


                firebase.auth().createUserWithEmailAndPassword(email, password)
                    .then(data => {
                        newUser.userId = data.user.uid
                        return data.user.getIdToken(true)

                    })
                    .then(token => {
                        newUser.token = token;
                        newUser.createdAt = new Date().toISOString()
                        return db.doc(`/users/${email}`).set(newUser)

                    })
                    .then(() => {
                        return res.status(201)
                            .send({
                                message: `User created successfully`,
                                newUser
                            })
                    })
                    .catch(err => {
                        console.error('eerroe1', err);
                        return res.status(500)
                            .send({
                                message: 'server error',
                                err
                            })
                    })
            })
            .catch(err => {
                console.error('error2', err);
                return res.status(500)
                    .send({
                        message: 'server error',
                        err
                    })
            })
    }
}

module.exports = new UserController()