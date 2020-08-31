import React ,{useEffect,useState}from 'react'
import { Tooltip,Icon} from 'antd';
import Axios from 'axios';


function LikeDislikes(props) {

    const [Likes, setLikes] = useState(0)
    const [LikeAction, setLikeAction] = useState(null)

    const [Dislikes, setDislikes] = useState(0)
    const [DislikeAction, setDislikeAction] = useState(null)

    let variable={}
    if(props.movie){//영화 좋아요 싫어요
        variable={movieId: props.movieId , userId: props.userId}
        console.log("확인",variable)
    }
    else{//댓글 좋아요 싫어요
       variable={commentId :props.commentId , userId:props.userId }
    }
    useEffect(() => {

        Axios.post('/api/like/getLikes',variable)
        .then(response=>{
            if(response.data.success){
                //얼마나 많은 좋아요를 받았는지
                setLikes(response.data.likes.length)
                console.log("likes수",Likes)
                //내가 이미 좋아요를 눌렀는지 총 2가지 정보 확인함
                response.data.likes.map(like=>{
                    console.log("지금유저",props.userId)
                    console.log("지금like",like.userId)
                    if(like.userId===props.userId){
                        setLikeAction('liked')
                    }
                })
            }
            else{
                alert('Likes에 대한 정보를 가져오지 못했습니다.')
            }
        })

        Axios.post('/api/like/getDislikes',variable)
        .then(response=>{
            if(response.data.success){
                //얼마나 많은 싫어요를 받았는지
                setDislikes(response.data.dislikes.length)
                //내가 이미 싫어요를 눌렀는지 총 2가지 정보 확인함
                response.data.dislikes.map(dislike=>{
                    if(dislike.userId===props.userId){
                        setDislikeAction('disliked')
                    }
                })
            }
            else{
                alert('Dislikes에 대한 정보를 가져오지 못했습니다.')
            }
        })

    }, [])

    const onLike=()=>{
        if(LikeAction===null){//좋아요 클릭이 안되어있을 경우
            console.log("들어옴")
            Axios.post('/api/like/upLike',variable)
            .then(response=>{
                if(response.data.success){
                    setLikes(Likes+1)
                    setLikeAction('liked')
                    if(DislikeAction!==null){
                        setDislikeAction(null)
                        setDislikes(Dislikes-1)
                    }
                }
                else{
                    console.log(response.data.err)
                    alert('Like를 올리지 못했습니다.')
                }
            })
        }
        else{//이미 좋아요 되어있는 걸 다시 클릭하면 unlike로 바꿔줌
            Axios.post('/api/like/unLike',variable)
            .then(response=>{
                if(response.data.success){
                    setLikes(Likes-1)
                    setLikeAction(null)
                }
                else{
                    alert('Like를 내리지 못했습니다.')
                }
            })
        }
    }

    // const onDislike=()=>{

    // }
    return (
        <div>
            <span key="comment-basic-like">
                <Tooltip title="Like">
                    <Icon type="like"
                        theme={LikeAction==='liked' ? 'filled' : 'outlined'}
                        onClick={onLike}
                    />
                </Tooltip>
            <span style={{paddingLeft:'8px',cursor:'auto'}}>{Likes} </span>
            </span>

            <span key="comment-basic-dislike">
                <Tooltip title="Dislike">
                    <Icon type="dislike"
                        theme={DislikeAction==='disliked' ? 'filled' : 'outlined'}
                        onClick//={onDislike}
                    />
                </Tooltip>
            <span style={{paddingLeft:'8px',cursor:'auto'}}> {Dislikes} </span>
            </span>
        </div>
    )
}

export default LikeDislikes
