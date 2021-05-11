const book = require('./bookModel');
const {verifyAccessToken}=require('../userAccount/userController')

const getBooks=async function(req,res){
    try{
            const book1=await book.find(req.query)
            res.status(201).json(book1)
        }
        catch(err){
        res.status(400).send(err);
    }
}
const createBook=async(req,res)=>{
    const authHeader=req.headers['authorization']
    const newBook=new book({
        title: req.body.title,
        author:req.body.author,
        price:req.body.price,
        rating: req.body.rating,
        description:req.body.description,
        cover:req.body.cover,
        pages: req.body.pages,
        votes:req.body.votes,
        tags:req.body.tags,
        series: req.body.series,
        seriesIndex:req.body.seriesIndex,
        releaseDate:req.body.releaseDate,
        isbn:req.body.isbn
        });
       // console.log(req.headers['authorization']);
    try{
        if(authHeader){
            const bearerToken=authHeader.split(' ');
            const token=bearerToken[1];
            const isAuth=verifyAccessToken(token);
           // console.log(isAuth);
            if(isAuth){
                const b1=await newBook.save();
                res.status(201).json(b1);
            }
            else{
                res.status(400).send('unauthorized')
            }
        }
    }catch(err){
        res.status(400).send(err);
    }

}
const getBookById=async(req,res)=>{
    try{
        const book1=await book.findById(req.params.id)
        res.status(201).json(book1)

    }catch(err){
        res.status(400).send(err);
    }
}
const getBookByAuthor=async(req,res)=>{
    try{
       const book1=await book.find({author:{$regex:new RegExp(req.params.author,"i")}})
        res.status(201).json(book1)

    }catch(err){
        res.status(400).send(err);
    }
}
const partialTextSearch=async(req,res)=>{
    try{
       const book1=await book.find({$or:[
           {author:{$regex:new RegExp(req.query.q,"i")}},
           {title:{$regex:new RegExp(req.query.q,"i")}},
           {description:{$regex:new RegExp(req.query.q,"i")}},
           {tags:{$regex:new RegExp(req.query.q,"i")}}
        ]})
        res.status(201).json(book1)

    }catch(err){
        res.status(400).send('author');
    }
}
const getBookByRating=async(req,res)=>{
    try{
       const book1=await book.find({rating:{$gte:req.params.rating}})
        res.status(201).json(book1)

    }catch(err){
        res.status(400).send(err);
    }
}
const getBookByPrice=async(req,res)=>{
    try{
       const book1=await book.find({price:{$gte:req.params.min,$lte:req.params.max}})
        res.status(201).json(book1)

    }catch(err){
        res.status(400).send(err);
    }
}
const updateBook=async(req,res)=>{
    const authHeader=req.headers['authorization']
    try{
        if(authHeader){
            const bearerToken=authHeader.split(' ');
            const token=bearerToken[1];
            const isAuth= verifyAccessToken(token);
            if(isAuth){
                const id=req.params.id;
                const update=req.body;
                const options={new:true}
                const user1=await book.findByIdAndUpdate(id,update,options);
                res.status(201).send(user1);
            }else{
                res.status(400).send('unauthorized')
            }
        }
    }catch(err){
        res.status(400).send(err);
        process.exit(1)
    }
}
const deleteBook=async(req,res)=>{
    const authHeader=req.headers['authorization']
    try{
        if(authHeader){
            const bearerToken=authHeader.split(' ');
            const token=bearerToken[1];
            const isAuth= verifyAccessToken(token);
            if(isAuth){
                const book1=await book.findById(req.params.id)
                book1.remove();
                res.status(201).send("deleted book");
            }else{
                res.status(400).send('unauthorized')
            }
            }
    }catch(err){
        res.status(400).send(err);
    }
}
module.exports={getBooks,createBook,getBookById,getBookByAuthor,partialTextSearch,
    getBookByRating,updateBook,getBookByPrice,
    deleteBook};