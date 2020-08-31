import React,{useState} from 'react'
import {Comment,Avatar,Button,Input} from 'antd';
import Axios from 'axios';
import LikeDislikes from './LikeDislikes'

const {TextArea} =Input;

function SingleComment(props) {
    const movieId=props.movieId
    const [OpenReply,setOpenReply]=useState(false)
    const [CommentValue, setCommentValue] = useState("")
    const onClickReplyOpen=()=>{
        setOpenReply(!OpenReply)
    }

    const onHandleChange=(event)=>{ //키보드를 치면 댓글이 입력됨
        setCommentValue(event.currentTarget.value)
    }

    const onSubmit=(event)=>{
        event.preventDefault();

        const variables={
            content:CommentValue ,
            writer:  localStorage.getItem('userId'),
            movieId:movieId,
            responseTo:props.comment._id
        }
        
        Axios.post('/api/comment/saveComment',variables)
        .then(response=>{
            if(response.data.success){
                console.log("서버",response.data.result)
                setCommentValue("")
                setOpenReply(false)
                props.refreshFunction(response.data.result)
            }
            else{
                console.log(response.data.err)
                alert('커멘트를 저장하지 못했습니다.')
            }
        })
    }

    const actions=[
        <LikeDislikes userId={localStorage.getItem('userId')} commentId={props.comment._id}/>
        ,<span onClick={onClickReplyOpen} key="comment-basic-reply-to">Reply to</span>
    ]


    return (
        <div>
            <Comment
                actions={actions}
                author={props.comment.writer.name}
                avatar={<Avatar src={props.comment.writer.image} alt />}
                content={<p>{props.comment.content} </p>}
            />
            {OpenReply &&
                <form style={{display:'flex'}} onSubmit={onSubmit}>
                    <textarea
                        style={{width:'100%',borderRadius: '5px'}}
                        onChange={onHandleChange}
                        value={CommentValue}
                        placeholder="write some comments"
                    />
                    <br />
                    <button style={{width:'20%',height:'52px'}} onClick={onSubmit}>Submit</button>
                </form>
            }

        </div>
    )
}

export default SingleComment
