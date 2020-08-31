const express = require('express');
const router = express.Router();
const{Favorite}=require('../models/Favorite')

router.post('/favoriteNumber',(req,res)=>{

    req.body.movieId

    //몽고디비에서 해당 영화id의 favorite숫자 가져오기
    Favorite.find({"movieId":req.body.movieId})
        .exec((err,info)=>{
            if(err) return res.status(400).send(err)

            res.status(200).json({success:true, favoriteNumber:info.length})//3명이 좋아하면 [1,2,3] length 3개
        })
        
    //그 다음에 프론트네 다시 숫자 정보 보내기
})

router.post('/favorited',(req,res)=>{

    //몽고디비에서 해당 영화id의 favorite숫자 가져오기
    Favorite.find({"movieId":req.body.movieId,"userFrom":req.body.userFrom})
        .exec((err,info)=>{
            if(err) return res.status(400).send(err)
            //[]빈 이스트면 해당 유저가 favorite하지 않음
            console.log("favoritesserver",info)
            let result=false;
            if(info.length!==0){
                result=true
            }

            res.status(200).json({success:true, favorited:result})
        })
        
    //그 다음에 프론트에 다시 숫자 정보 보내기
})

router.post('/removeFromFavorite',(req,res)=>{

    Favorite.findOneAndDelete({movieId:req.body.movieId,userFrom:req.body.userFrom})//해당 데이터 1개 찾아서 Favorite document에서 삭제
    .exec((err,doc)=>{//doc은 몽고디비에서 보내주는 결과값
        if(err) return res.status(400).send(err)
        return res.status(200).json({success:true})
    })
})

router.post('/addToFavorite',(req,res)=>{

    const favorite=new Favorite(req.body) //새로운 데이터 생성해서 디비에 넣어줌
    console.log(req.body)
    console.log(favorite)
    favorite.save((err,doc)=>{
        if(err) return res.status(400).send(err)
        return res.status(200).json({success:true})
    }) //favorite document에 저장함 에러나면 에러 반환

})

router.post('/getFavoritedMovie',(req,res)=>{

   Favorite.find({'userFrom':req.body.userFrom})
    .exec((err,favorites)=>{
        if(err) return res.status(400).send(err)
        return res.status(200).json({success:true,favorites})
    })

})

router.post('/removeFromFavorite',(req,res)=>{

   Favorite.findOneAndDelete({movieId:req.body.movieId,userFrom:req.body.userFrom})
   .exec((err,result)=>{
       if(err) return res.status(400).send(err)
       return res.status(200).json({success:true})
   })
 
 })

module.exports = router;
