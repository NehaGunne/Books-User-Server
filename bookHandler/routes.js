const express = require('express');
const bookController=require('./bookController');
const router=express.Router();
router.get('/',bookController.getBooks);
router.post('/add-book',bookController.createBook)
router.get('/:id',bookController.getBookById)
router.get('/by/:author',bookController.getBookByAuthor);
router.get('/text/matching',bookController.partialTextSearch)
router.get('/books-with-min-rating/:rating',bookController.getBookByRating);
router.get('/price/:min/:max',bookController.getBookByPrice);
router.put('/:id',bookController.updateBook);
router.delete('/:id',bookController.deleteBook);
module.exports=router;