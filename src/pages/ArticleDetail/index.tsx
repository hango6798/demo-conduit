import { useParams } from "react-router-dom"
import { Heading } from "../../components/Layout/Heading"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { useEffect, useState } from "react"
import { getCurrentArticle } from "../../store/ArticlesSlice"
import Skeleton from "react-loading-skeleton"
import { Author } from "../../components/Author"
import { AuthorSkeleton } from "../../components/Author/AuthorSkeleton"
import { Button } from "react-bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons"
import { FavoriteButton } from "../../components/FavoriteButton"
import { ContentWrapper } from "../../components/Layout/ContentWrapper/ContentWrapper"
import { unfollow, follow } from "../../store/profilesSlice"
import { setShowPopup } from "../../store/userSlice"
import "./style.scss"

export const ArticleDetail = () => {
    const parser = new DOMParser()
    const dispatch = useAppDispatch()
    const {currentArticle, status} = useAppSelector(store => store.articlesReducer)
    const {token} = useAppSelector(store => store.userReducer)
    const createdTime = new Date(currentArticle.createdAt).toLocaleString('en-us',{ month:'long', day: 'numeric', year:'numeric'})
    const isLoading = status.currentArticle === "loading"

    const articleBodyHTML = parser.parseFromString(currentArticle.body.replaceAll("\\n", "<br />"), "text/html").body

    const [following, setFollowing] = useState<boolean>(false)

    const [favCount, setFavCount] = useState<number>(0)
    const [favActive, setFavActive] = useState<boolean>(false)

    const author = currentArticle.author

    const {slug} = useParams()

    useEffect(() => {
        slug && dispatch(getCurrentArticle(slug))
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [slug])

    useEffect(() => {
        if(status.currentArticle === "idle"){
            setFavCount(currentArticle.favoritesCount)
            setFavActive(currentArticle.favorited)
            setFollowing(currentArticle.author.following)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [slug, status.currentArticle])

    const handleFollow = () => {
        const username = author.username
        if(token) {
            setFollowing(!following)
            if(author.following) {
                dispatch(unfollow(username))
            }
            else{
                dispatch(follow(username))
            }
        }
        else{
            dispatch(setShowPopup(true))
        }
    }

    return status.currentArticle === "failed" ? <div className="h3 text-center my-5">Get data failed!</div>
        : <div className="mb-5">
            <Heading background="dark" color="white">
                <div className="text-start">
                    <div className="h2 mb-4">
                        {
                            isLoading ?
                            <Skeleton count={2}/>
                            : currentArticle.title
                        }
                    </div>
                    <div className="d-flex align-items-center flex-wrap">
                        {
                            isLoading ? 
                            <div className="me-3 mb-2"><AuthorSkeleton /></div>
                            : <div className="d-flex align-items-center me-3 mb-2">
                                <Author author={author} createdTime={createdTime} variant="dark"/>
                            </div>
                        }
                        {
                            isLoading ? 
                            <div className="d-flex">
                                <Skeleton width={80} height={30} className="me-2"/>
                                <Skeleton width={80} height={30}/>
                            </div>
                            :<div className="d-flex align-items-center justify-content-between mb-2">
                                <Button variant="outline-light" className="me-2 fw-bold" size="sm" onClick={handleFollow} active={following}>
                                    <FontAwesomeIcon icon={following ? faMinus : faPlus} className="me-2"/>
                                    {
                                        following ? "Unfollow" : "Follow"
                                    }
                                </Button>
                                <span className="ms-auto">
                                    <FavoriteButton article={currentArticle} favCount={favCount} setFavCount={setFavCount} favActive={favActive} setFavActive={setFavActive} variant="outline-primary"/>
                                </span>
                            </div>
                        }
                    </div>
                </div>
            </Heading>
            <ContentWrapper>
                <div className="my-4">
                    {
                        isLoading ? <Skeleton count={10}/>
                        : <div dangerouslySetInnerHTML={{__html: articleBodyHTML.innerHTML}}></div>
                    }
                </div>
                {
                    isLoading ? null
                    : <ul className="tags d-flex flex-wrap">
                    {
                        currentArticle.tagList && 
                        currentArticle.tagList.map((tag:string, index:number) => {
                            return <li key={index} className="mx-1 rounded border px-2 py-1 small text-secondary">{tag}</li>
                        })
                    }
                </ul>
                }
                <hr className="my-4"/>
                <div className="d-flex align-items-center flex-wrap justify-content-center">
                    {
                        isLoading ?
                        <div className="me-3 mb-2"><AuthorSkeleton /></div>
                        : <div className="d-flex align-items-center me-3 mb-2">
                            <Author author={author} createdTime={createdTime} variant="light"/>
                            
                        </div>
                    }
                    {
                        isLoading ? 
                        <div className="d-flex">
                            <Skeleton width={80} height={30} className="me-2"/>
                            <Skeleton width={80} height={30}/>
                        </div>
                        : <div className="d-flex align-items-center justify-content-center mb-2">
                            <Button variant="outline-success" className="me-2 fw-bold" size="sm" onClick={handleFollow} active={following}>
                                <FontAwesomeIcon icon={following ? faMinus : faPlus} className="me-2"/>
                                {
                                    following ? "Unfollow" : "Follow"
                                }
                            </Button>
                            <span className="ms-auto">
                                <FavoriteButton article={currentArticle} favCount={favCount} setFavCount={setFavCount} favActive={favActive} setFavActive={setFavActive} variant="outline-primary"/>
                            </span>
                        </div>
                    }
                </div>
            </ContentWrapper>
        </div>
}