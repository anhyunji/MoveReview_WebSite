import React,{useEffect,useState} from 'react'
import {API_URL,API_KEY,IMAGE_BASE_URL} from '../../Config';
import MainImage from "../LandingPage/Sections/MainImage";
import MovieInfo from "./Sections/MovieInfo";
import GridCards from '../commons/gridCards';
import Favorite from './Sections/Favorite';
import {Row, List} from 'antd';
import Comment from './Sections/Comment'
import Axios from 'axios';
import LikeDislikes from './Sections/LikeDislikes'
function MovieDetail(props) {

let movieId= props.match.params.movieId;
const variable={movieId:movieId}
const [Movie,setMovie]=useState([])
const [Casts,setCast]=useState([])
const [ActorToggle,setActorToggle] =useState(false)
const [Comments, setComments] = useState([])
    useEffect(()=>{
       
        let endPointCrew=`${API_URL}movie/${movieId}/credits?api_key=${API_KEY}`;
        let endPointInfo=`${API_URL}movie/${movieId}?api_key=${API_KEY}`;
        fetch(endPointInfo)
        .then(response=> response.json())
        .then(response => {
            console.log(response)
            setMovie(response)
        })

        fetch(endPointCrew)
        .then(response=> response.json())
        .then(response => {
            setCast(response.cast)
        })

        Axios.post('/api/comment/getComments',variable)
        .then(response=>{
            if(response.data.success){
                setComments(response.data.comments)
                console.log("댓글불러오기",response.data.comments)
            }
            else{
                console.log(response.data.err)
                alert('코멘트 정보를 가져오는 것을 실패했습니다.')
            }
        })

    },[])
    
    const refreshFunction=(newComment)=>{
        setComments(Comments.concat(newComment))
    }
    const toggleActorView=()=>{
        setActorToggle(!ActorToggle)
    }

    return (
        <div>
            {/* Header */}

            <MainImage 
                image={`${IMAGE_BASE_URL}w1280${Movie.backdrop_path}`}
                title={Movie.original_title}
                text={Movie.overview} 
                />

            {/*Body */}
            <div style={{width: '85%',margin: '1rem auto'}}>
                <div style={{display:'flex',justifyContent:'flex-end'}}>
                    <Favorite  MovieInfo={Movie} movieId={movieId} userFrom={localStorage.getItem('userId')}/>
                </div>
                {/*Movie info*/}
            <MovieInfo
                movie={Movie}
            />
                <br />
                {/* Actors Grid*/}
                <div style={{display: 'flex',justifyContent: 'center',margin:'2rem'}}>
                    <button onClick={toggleActorView}>Toggle Actor View</button>
                </div>

                {ActorToggle && 
                <Row gutter={[16,16]}>
                    {Casts&& Casts.map((cast,index)=>(
                        <React.Fragment key={index}>
                            <GridCards 
                                image={cast.profile_path ?
                                    `${IMAGE_BASE_URL}w500${cast.profile_path}` : null}
                                characterName={cast.name}
                            />
                        </React.Fragment>
                    ))}
                    
                </Row>
                }
                <List.Item
                    actions={[<LikeDislikes  movie  userId={localStorage.getItem('userId')}
                            movieId={movieId}/>]}
                >
                </List.Item>
            </div>
            {/*댓글작성기능 컴포넌트*/}
            <Comment  title={Movie.original_title} refreshFunction={refreshFunction} commentsList={Comments} movieId={movieId} />
        </div>
    )
}

export default MovieDetail
