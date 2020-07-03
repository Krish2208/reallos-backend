const {db} = require('../utils/admin');

const config = require('../utils/firebaseConfig');

const firebase = require('firebase');

firebase.initializeApp(config);

exports.signup = (req,res)=>{
    const newUser = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone,
        role: req.body.role,
        state: req.body.state,
        password: req.body.password
    }; // Getting all the data from the signup form

    let jwttoken,userId; // intitalizing the token 
    firebase.auth()
    .createUserWithEmailAndPassword(newUser.email,newUser.password) // creating a new user with email and password
    .then(data =>{
        userId = data.user.uid;
        return data.user.getIdToken(); // Returns a promise with the jwt token
    })
    .then( token =>{
        jwttoken = token;
        const userData = { 
            id: userId, 
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            phone: newUser.phone,
            role: newUser.role,
            state: newUser.state,
            createdAt: new Date().toISOString()
        }

        return db.doc(`/users/${userData.id}`).set(userData);
    })
    .then(()=>{
        return res.status(201).json({token: jwttoken});
    })
    .catch(err =>{
        console.error(err);
        if(err.code === 'auth/email-already-in-use'){
            return res.status(400).json({email: 'Email is already in use'})
        }
        else{
            return res.status(500).json({ error: err.code });
        }
    })
}

exports.login = (req,res)=>{
    const user = {
        email: req.body.email,
        password: req.body.password
    }

    firebase.auth().signInWithEmailAndPassword(user.email,user.password)
    .then(data =>{
        return data.user.getIdToken();
    })
    .then(token =>{
        return res.json({ token });
    })
    .catch(err =>{
        console.error(err);
        if(err.code === 'auth/wrong-password'){
            return res.status(403).json({general: 'wrong credentials, please try again'})
        }
        else{
            return res.status(500).json({error: err.code})
        }
    })
}