import { useParams } from "react-router-dom"
import { Heading } from "../../components/Layout/Heading"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { useEffect } from "react"
import { getCurrentArticle, setCurrentArticle } from "../../store/articlesSlice"
import { Author } from "../../components/Author"
import { Button } from "react-bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons"
import { FavoriteButton } from "../../components/FavoriteButton"
import { ContentWrapper } from "../../components/Layout/ContentWrapper/ContentWrapper"
import { unfollow, follow } from "../../store/profilesSlice"
import { setPopupType, setShowPopup } from "../../store/userSlice"
import "./style.scss"
import { ArticleDetailSkeleton } from "../../components/Skeleton/ArticleDetailSkeleton"
import { Comments } from "../../components/Comments"

export const ArticleDetail = () => {
    const {slug} = useParams()
    const parser = new DOMParser()
    const dispatch = useAppDispatch()

    // get global state from store
    const {currentArticle, status : articleStatus} = useAppSelector(store => store.articlesReducer)
    const {status: profileStatus} = useAppSelector(store => store.profilesReducer)
    const {token} = useAppSelector(store => store.userReducer)
    

    const createdTime = new Date(currentArticle.createdAt).toLocaleString('en-us',{ month:'long', day: 'numeric', year:'numeric'})
    const articleBodyHTML = parser.parseFromString(currentArticle.body.replaceAll("\\n", "<br />"), "text/html").body
    
    const author = currentArticle.author

    useEffect(() => {
        slug && dispatch(getCurrentArticle(slug))
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [slug])

    const handleFollow = () => {
        const username = author.username
        if(token) {
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
            author.following ? setFollowing(false) : setFollowing(true)
        }
        else{
            dispatch(setPopupType('login'))
            dispatch(setShowPopup(true))
        }
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
                                <Button variant={author.following ? "light" :"outline-light"} className="me-2 fw-bold" size="sm" onClick={handleFollow} disabled={profileStatus.follow ==="loading"}>
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
                            <Button variant={author.following ? "success" :"outline-success"} className="me-2 fw-bold" size="sm" onClick={handleFollow} active={author.following} disabled={profileStatus.follow ==="loading"}>
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
                    <Comments slug={slug}/>
                </ContentWrapper>
            </div>
        }
    </div>
}