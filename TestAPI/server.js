const express = require('express')
const app = express();

//Test registration POST
app.post('/registration',(req,res)=>{
    console.log('registration request ! '+req)
    res.send('Got registration information!')
})


//Test registration POSTs
app.post('/token',(req,res)=>{
    console.log('token request ! '+req.data)
    res.send('Got token!')

})


app.listen(8080,(err)=>{
    if(!err) console.log('Test front-end server success')
})