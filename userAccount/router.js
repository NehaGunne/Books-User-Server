const express = require('express');
const userController=require('./userController');
const router=express.Router();
router.get('/',userController.getUsers);
router.post('/signup',userController.createUser);
router.post('/login',userController.login_post);
router.get('/logout',userController.logOut)


router.put('/:id',userController.updatePassword);
router.delete('/:id',userController.deleteUser);

module.exports=router;