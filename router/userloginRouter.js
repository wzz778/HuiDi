const express = require('express');
const router = express.Router();
router.get('*', (req, res, next) => {
    if (req.session.token) {
        return next();
    } else {
        res.render('login.html');
    }
})

router.get('/Personalhomepage',(req,res)=>{
    res.render('Personalhomepage.html')
})
router.get('/modifymessage',(req,res)=>{
    res.render('modifymessage.html')
})
router.get('/reemail',(req,res)=>{
    res.render('reemail.html')
})
router.get('/mymessage',(req,res)=>{
    res.render('mymessage.html')
})
router.get('/MyFollowers',(req,res)=>{
    res.render('MyFollowers.html')
})
router.get('/Myfans',(req,res)=>{
    res.render('Myfans.html')
})
router.get('/chatmessage',(req,res)=>{
    res.render('chatmessage.html')
})
router.get('/nowchatmessage',(req,res)=>{
    res.render('nowchatmessage.html')
})
router.get('/likemessage',(req,res)=>{
    res.render('likemessage.html')
})
router.get('/collectmessage',(req,res)=>{
    res.render('collectmessage.html')
})
router.get('/focusmessage',(req,res)=>{
    res.render('focusmessage.html')
})
router.get('/commentmessage',(req,res)=>{
    res.render('commentmessage.html')
})
router.get('/chat',(req,res)=>{
    res.render('chat.html')
})
module.exports=router;