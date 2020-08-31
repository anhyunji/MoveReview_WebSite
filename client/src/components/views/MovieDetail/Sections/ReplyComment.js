import React,{useState,useEffect} from 'react'
import SingleComment from './SingleComment';

function ReplyComment(props) {

    const [ChildCommentNumber, setChildCommentNumber] = useState(0)
    const [OpenReplyComments, setOpenReplyComments] = useState(false)
    useEffect(() => {
       let commentNumber=0;
       props.commentsList.map((comment)=>{
           if(comment.responseTo===props.parentCommentId){
               commentNumber ++
           }
       })
       setChildCommentNumber(commentNumber)
    }, [props.commentsList])//얘는 load될 때 딱 한번 실행 그래서 commentNumber가바뀔때마다 useEffect 계속 실행

    const renderReplyComment=(parentCommentId)=>
        props.commentsList.map((comment,index)=>(
            <React.Fragment>
                {
                    comment.responseTo ===parentCommentId &&
                    <div style={{width:'80%',marginLeft:'40px'}}>
                        <SingleComment refreshFunction={props.refreshFunction} comment={comment} movieId={props.movieId} />
                        <ReplyComment refreshFunction={props.refreshFunction} commentsList={props.commentsList} movieId={props.movieId} parentCommentId={comment._id}/>
                    </div>
                }
            </React.Fragment>
        ))



    const onHandleChange=()=>{
        setOpenReplyComments(!OpenReplyComments)
    }

    return (
        <div>

            {ChildCommentNumber >0 && 
                <p style={{fontSize:'14px',margin:0,color:'gray'}} onClick={onHandleChange}>
                    View {ChildCommentNumber} more comment(s)
                </p>
            }

            {OpenReplyComments &&
                renderReplyComment(props.parentCommentId)
            }
            
        </div>
    )
}

export default ReplyComment
