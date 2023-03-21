const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    console.log('checking authorization...');
    try{
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decoded;
        console.log('AUTHORIZED!');
        next();
    } catch(err) {
        console.log('not authorized');
        return res.status(401).json({
            message: 'Auth failed'
        });
    }
};