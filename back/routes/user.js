const express = require('express'); 
const router = express.Router(); 
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config'); 

const userCtrl = require('../controllers/user');
const pwdCtrl = require('../middleware/PwdControl');
const max = require("../middleware/limiter");

router.post('/auth/signup', pwdCtrl, userCtrl.signup);
router.post('/auth/login', max.limiter, userCtrl.login);
router.get('/accounts', auth, userCtrl.getAllUsers);
router.get('/accounts/:id', auth, userCtrl.getUser); // get one user
router.put('/accounts/:id', auth, multer, userCtrl.updateUser);  // update user
router.delete('/accounts/:id', auth, multer, userCtrl.deleteUser); 

module.exports = router;
