const express=require('express');
const mongoose=require('mongoose');
const cookieParser=require('cookie-parser')
const cors=require('cors')
const url='mongodb://localhost/MyDb';
const app=express();
mongoose.connect(url,{useNewUrlParser:true},{useUnifiedTopology: true });
const con=mongoose.connection;
con.on('open',()=>{
    console.log("connected");
})
app.use(express.json());
app.use(cookieParser());
app.use(cors({origin:true,
        credentials:true,}));
const bookRouter=require('./bookHandler/routes')
app.use('/books',bookRouter);
const userRouter=require('./userAccount/router')
app.use('/users',userRouter);
app.listen(8000,()=>{
    console.log("server started");
});