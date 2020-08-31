const express = require('express');
const router = express.Router();
const{Like}=require('../models/Like')
const{Dislike}=require('../models/Dislike')

router.post('/getLikes',(req,res)=>{
   
    let variable={}

    if(req.body.movieId){
        variable={movieId:req.body.movieId}
    }
    else{
        variable={commentId:req.body.commentId}
    }
   Like.find(variable)
   .exec((err,likes)=>{
       if(err) return res.status(400).send(err)
       return res.status(200).json({success:true,likes})
   })
   
});

router.post('/getDislikes',(req,res)=>{
   
    let variable={}

    if(req.body.movieId){
        variable={movieId:req.body.movieId}
    }
    else{
        variable={commentId:req.body.commentId}
    }
    Dislike.find(variable)
   .exec((err,dislikes)=>{
       if(err) return res.status(400).send(err)
       return res.status(200).json({success:true,dislikes})
   })
   
});

router.post('/upLike',(req,res)=>{
   
    let variable={}

    if(req.body.movieId){
        variable={movieId: req.body.movieId , userId: req.body.userId}
    }
    else{
        variable={commentId :req.body.commentId , userId:req.body.userId }
    }
    //Like collection에다가 클릭 정보 넣어주기
    const like=new Like(variable)
    console.log(like)
    like.save((err,likeResult)=>{
        if(err) return res.json({success:false,err})

         //만약에 싫어요가 이미 클릭이 되어있다면 싫어요 1 줄여주기
         Dislike.findOneAndDelete(variable)
            .exec((err,dislikeResult)=>{
                if(err) {
                    console.log(err)
                    return res.status(400).json({success:false,err})

                }
                return res.status(200).json({success:true})
            })

    })
   
});

router.post('/unLike',(req,res)=>{
   
    let variable={}

    if(req.body.movieId){
        variable={movieId: req.body.movieId , userId: req.body.userId}
    }
    else{
        variable={commentId :req.body.commentId , userId:req.body.userId }
    }

    Like.findOneAndDelete(variable)
    .exec((err,result)=>{
        if(err) return res.status(400).json({success:false,err})
        return res.status(200).json({success:true})
    })
});


module.exports = router;
