const express = require('express');
const router = express.Router();
const db = require('../ir/index_rerum.js');

function getAuthorById(authorId){
    const author = db.prepare(`
    SELECT * 
    FROM authors
    WHERE id = ?`).get(authorId);

    if (!author){
        return null;
    }
    return author;
}

router.get('/',(req,res)=>{
    try {
        const author = db.prepare(`SELECT * FROM authors ORDER BY last_name`).all();
        res.json(author);
    }
    catch(err){
        res.status(500).json({error:`Error ${req}`});
    }
})

router.get('/:id',(req,res)=>{
    const id = Number(req.params.id);

    if(!Number.isInteger(id)) {
        return res.status(400).json({error: 'Not a number'});
    }
    try{
        const author = getAuthorById(id);
        if(!author){
            return res.status(404).json({error: 'Not a author'});
        }
        res.json(author);
    }
    catch(err){
        res.status(500).json({error:err});
    }
})

module.exports = router;