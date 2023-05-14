const express = require('express');
const { createUser, getUser, changePassword } = require('./controllers/userController');



const router = express.Router();

router.get('/test-me', (req, res) => {
    console.log('Hey....!! I am Test Me Handler')
    return res.status(200).send('Hey....!! I am Test Me Handler');
});

router.post('/sign-in', createUser);
router.get('/get-all-user', getUser);
router.put('/update-password', changePassword);

//FOR WRONG URL
router.all('/**', (req, res) => {
    return res.status(404).send({ msg: 'This url is invalid' })
})

module.exports = router;