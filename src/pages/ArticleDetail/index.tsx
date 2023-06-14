import { Link, useParams } from "react-router-dom"
import { Heading } from "../../components/Layout/Heading"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { useEffect } from "react"
import { getCurrentArticle, setCurrentArticle } from "../../store/articlesSlice"
import { Author } from "../../components/Author"
import { Button, Form, Image } from "react-bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMinus, faPaperPlane, faPlus } from "@fortawesome/free-solid-svg-icons"
import { FavoriteButton } from "../../components/FavoriteButton"
import { ContentWrapper } from "../../components/Layout/ContentWrapper/ContentWrapper"
import { unfollow, follow } from "../../store/profilesSlice"
import { setShowPopup } from "../../store/userSlice"
import "./style.scss"
import { ArticleDetailSkeleton } from "../../components/Skeleton/ArticleDetailSkeleton"
import { createComment, getComments } from "../../store/commentsSlice"
import { Comment } from "../../models"

export const ArticleDetail = () => {
    const parser = new DOMParser()
    const dispatch = useAppDispatch()
    const {currentArticle, status : articleStatus} = useAppSelector(store => store.articlesReducer)
    const {status: profileStatus} = useAppSelector(store => store.profilesReducer)
    const {comments} = useAppSelector(store => store.commentsReducer)
    const {token} = useAppSelector(store => store.userReducer)

    const createdTime = new Date(currentArticle.createdAt).toLocaleString('en-us',{ month:'long', day: 'numeric', year:'numeric'})

    const articleBodyHTML = parser.parseFromString(currentArticle.body.replaceAll("\\n", "<br />"), "text/html").body


    const author = currentArticle.author

    const {slug} = useParams()

    useEffect(() => {
        if(slug){
            dispatch(getCurrentArticle(slug))
            dispatch(getComments(slug))
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [slug])

    const handleFollow = () => {
        const username = author.username
        const setFollowing = (state: boolean) => {
            dispatch(setCurrentArticle({
                ...currentArticle,
                author: {
                    ...currentArticle.author,
                    following: state,
                }
            }))
            dispatch(state ? follow(username) : unfollow(username)).catch(err => {
                dispatch(setCurrentArticle({
                    ...currentArticle,
                    author: {
                        ...currentArticle.author,
                        following: !state,
                    }
                }))
            }) 
        }
        if(token) {
            if(author.following) {
                setFollowing(false)
            }
            else{
                setFollowing(true)
            }
        }
        else{
            dispatch(setShowPopup(true))
        }
    }

    const handleComment = () => {

    }

    return <div>
        {
            articleStatus.currentArticle === "failed" && <div className="h3 text-center my-5">Get data failed!</div>
        }
        {
            articleStatus.currentArticle === "loading" && <ArticleDetailSkeleton />
        }
        {
            currentArticle.slug &&
            <div className="mb-5">
                <Heading background="dark" color="white">
                    <div className="text-start">
                        <div className="h2 mb-4">
                            {currentArticle.title}
                        </div>
                        <div className="d-flex align-items-center flex-wrap">
                            <div className="d-flex align-items-center me-3 mb-2">
                                <Author author={author} createdTime={createdTime} variant="dark"/>
                            </div>
                            <div className="d-flex align-items-center justify-content-between mb-2">
                                <Button variant="outline-light" className="me-2 fw-bold" size="sm" onClick={handleFollow} active={author.following} disabled={profileStatus.follow ==="loading"}>
                                    <FontAwesomeIcon icon={author.following ? faMinus : faPlus} className="me-2"/>
                                    {
                                        author.following ? "Unfollow" : "Follow"
                                    }
                                </Button>
                                <span className="ms-auto">
                                    <FavoriteButton article={currentArticle} variant="outline-primary"/>
                                </span>
                            </div>
                        </div>
                    </div>
                </Heading>
                <ContentWrapper>
                    {/* Article Body */}
                    <div className="my-4">
                        <div dangerouslySetInnerHTML={{__html: articleBodyHTML.innerHTML}}></div>
                    </div>
                    <ul className="tags d-flex flex-wrap">
                        {currentArticle.tagList && 
                        currentArticle.tagList.map((tag:string, index:number) => {
                            return <li key={index} className="mx-1 rounded border px-2 py-1 small text-secondary">{tag}</li>
                        })}
                    </ul>
                    <hr className="my-4"/>
                    <div className="d-flex align-items-center flex-wrap justify-content-center mb-4">
                        <div className="d-flex align-items-center me-3 mb-2">
                            <Author author={author} createdTime={createdTime} variant="light"/>
                            
                        </div>
                        <div className="d-flex align-items-center justify-content-center mb-2">
                            <Button variant="outline-success" className="me-2 fw-bold" size="sm" onClick={handleFollow} active={author.following} disabled={profileStatus.follow ==="loading"}>
                                <FontAwesomeIcon icon={author.following ? faMinus : faPlus} className="me-2"/>
                                {
                                    author.following ? "Unfollow" : "Follow"
                                }
                            </Button>
                            <span className="ms-auto">
                                <FavoriteButton article={currentArticle} variant="outline-primary"/>
                            </span>
                        </div>
                    </div>
                    {/* Comments */}
                    <Form className="mb-3 rounded overflow-hidden">
                        <Form.Group>
                            <Form.Control as="textarea" rows={3} placeholder="Write a comment..."/>
                        </Form.Group>
                        <div className="d-flex justify-content-between align-items-center p-3 bg-primary">
                            <Link to={`/profiles/@${author.username}`} className="border border-2 border-light rounded">
                                <Image src={author.image} width={40} height={40} rounded/>
                            </Link>
                            <div className="disabled text-white fs-4" style={{cursor: "pointer"}} onClick={handleComment}>
                                <FontAwesomeIcon icon={faPaperPlane}/>
                            </div>
                        </div>
                    </Form>
                    {
                        !!comments.length &&
                        comments.map((comment: Comment) => {
                            const createdTime = new Date(comment.createdAt).toLocaleString('en-us',{ month:'long', day: 'numeric', year:'numeric'})
                            return <div key={comment.id} className="mb-3 rounded overflow-hidden">
                                <div className="p-3 rounded border">
                                    {comment.body}
                                </div>
                                <div className="d-flex justify-content-between align-items-center p-3 bg-secondary text-light">
                                    <div className="d-flex align-items-center">
                                        <Link to={`/profiles/@${comment.author.username}`} className="border border-2 border-light rounded me-2">
                                            <Image src={comment.author.image} width={30} height={30} rounded/>
                                        </Link>
                                        <Link to={`/profiles/@${comment.author.username}`} className="me-2 text-light">{comment.author.username}</Link>
                                    </div>
                                    <span className="opacity-75 small">{createdTime}</span>
                                </div>
                            </div>
                        })
                    }
                </ContentWrapper>
            </div>
        }
    </div>
}