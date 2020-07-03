const {admin} = require('./admin');

module.exports = (req,res,next)=>{ // Authorization middleware
    let jwtTokens; // intializing the token variable
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')){
        jwtTokens = req.headers.authorization.split('Bearer ')[1]; // getting the token
    }
    else{
        console.error('No token found')
        return res.status(403).json({error: 'Unauthorized'});
    }

    admin.auth().verifyIdToken(jwtTokens)
    .then(decodedData =>{
        req.user = decodedData;
        return next();
    })
    .catch(err =>{
        console.error('error while verifying the token '+err);
        return res.status(403).json(err);
    })
} 