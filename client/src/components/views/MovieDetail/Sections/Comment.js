import React ,{useState} from 'react'
import Axios from 'axios'
import SingleComment from './SingleComment'
import ReplyComment from './ReplyComment'
function Comment(props) {

const [commentValue, setcommentValue] = useState("")
const movieId=props.movieId
const movie_title=props.title

const handleClick=(event)=>{
    setcommentValue(event.currentTarget.value)
}

const onSubmit=(event)=>{
    event.preventDefault() //댓글 submit할때 페이지 초기화되는거 방지

    const variables={
        content:commentValue ,
        writer:  localStorage.getItem('userId'),
        movieId:movieId
    }
    
    Axios.post('/api/comment/saveComment',variables)
    .then(response=>{
        if(response.data.success){
            console.log("서버",response.data.result)
            setcommentValue("")
            props.refreshFunction(response.data.result)
        }
        else{
            console.log(response.data.err)
            alert('커멘트를 저장하지 못했습니다.')
        }
    })
}

    return (
        <div>
            <br />
            <p> Share your opinions about {movie_title}</p>
            <hr />

            {/*Comment lists*/}
            {props.commentsList && props.commentsList.map((comment,index)=>(
                (!comment.responseTo && 
                    <React.Fragment>
                        <SingleComment refreshFunction={props.refreshFunction} comment={comment} movieId={movieId} />
                        <ReplyComment refreshFunction={props.refreshFunction} parentCommentId={comment._id} movieId={movieId} commentsList={props.commentsList}/>
                    </React.Fragment>
                )
            ))}
            

            {/*Root Comment Form 루트맨 마지막 부분에 댓글 남기는 란 */}

            <form style={{display:'flex'}} onSubmit={onSubmit}>
                <textarea
                    style={{width:'100%',borderRadius: '5px'}}
                    onChange={handleClick}
                    value={commentValue}
                    placeholder="코멘트를 작성해 주세요"
                />
                <br />
                <button style={{width:'20%',height:'52px'}} onClick={onSubmit}>Submit</button>
            </form>
        </div>
    )
}

export default Comment
