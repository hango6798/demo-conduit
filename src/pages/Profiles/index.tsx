import { useNavigate, useParams } from "react-router-dom"
import { Heading } from "../../components/Layout/Heading"
import { useEffect, useMemo, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { follow, getProfile, unfollow } from "../../store/profilesSlice"
import { Button, Col, Image, Row } from "react-bootstrap"
import Skeleton from "react-loading-skeleton"
import { ContentWrapper } from "../../components/Layout/ContentWrapper/ContentWrapper"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus, faGear, faMinus } from "@fortawesome/free-solid-svg-icons"
import { setShowPopup } from "../../store/userSlice"
import { Tabs } from "../../components/Tabs"
import { Pagination } from "../../components/Pagination"
import { ParamsArticle } from "../../models"
import { ListArticle } from "../../components/ListArticle"
import { fetchGlobalArticles } from "../../store/ArticlesSlice"

export const Profile = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const params = useParams()
    const { token, user } = useAppSelector(store => store.userReducer)
    const { articlesCount } = useAppSelector(store => store.articlesReducer)
    const { profile, status } = useAppSelector(store => store.profilesReducer)

    const usernameParam:string = (params.username) ? params?.username?.replace('@', '') : ''

    const isUserProfile = user.username === usernameParam
    const currentProfile:any = isUserProfile ? user : profile
    const following = currentProfile.following

    // button follow / settings
    const buttonDisabled = status.follow === "loading"

    const buttonContent = useMemo(() => {
        if(isUserProfile){
            return <>
                <FontAwesomeIcon icon={faGear} className="me-2"/> 
                Edit Profile Settings
            </>
        }
        return <>
            <FontAwesomeIcon icon={following ? faMinus : faPlus} className="me-2"/> 
            {following ? "Unfollow" : "Follow"} {currentProfile.username}
        </>
    }, [currentProfile.username, following, isUserProfile])

    useEffect(() => {
        !isUserProfile && dispatch(getProfile(usernameParam))
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [usernameParam])

    const goToSetting = () => {
        navigate('/settings')
    }

    const handleFollow = () => {
        if(token) {
            currentProfile.following ? dispatch(unfollow(usernameParam)) : dispatch(follow(usernameParam))
        }
        else{
            dispatch(setShowPopup(true))
        }
    }
    const buttonClickEvent = isUserProfile ? goToSetting : handleFollow

    // List Articles
    
    // tabs
    const [currentTab, setCurrentTab] = useState<string>('myArticles')
    const listTabs = [
        {
            name: 'myArticles',
            hide: false,
            disabled: false,
            className: 'me-3',
            content: 'My Articles',
        },
        {
            name: 'favorited',
            hide: false,
            disabled: false,
            className: '',
            content: 'Favorited Articles'
        }
    ]
    const handleTabClick = (tab:string) => {
        setCurrentTab(tab)
        setCurrentPage(1)
        if(tab === 'myArticles') {
            dispatch(fetchGlobalArticles({
                ...articleParams,
                author: usernameParam,
            }))
        }
        else if(tab === 'favorited') {
            dispatch(fetchGlobalArticles({
                ...articleParams,
                favorited: usernameParam,
            }))
        }
    }
    // pagination
    const limit = 10
    const pagesCount = useMemo(() => {
        return Math.ceil(articlesCount / limit)
    }, [articlesCount])
    const [currentPage, setCurrentPage] = useState<number>(1)
    const articleParams: ParamsArticle = {
        limit: limit,
        offset: (currentPage - 1)*limit,
    }

    useEffect(() => {
        setCurrentTab('myArticles')
        dispatch(fetchGlobalArticles({
            ...articleParams,
            author: usernameParam,
        }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [usernameParam])

    useEffect(() => {
        if(currentTab === 'myArticles') {
            dispatch(fetchGlobalArticles({
                ...articleParams,
                author: usernameParam,
            }))
        }
        else if(currentTab === 'favorited') {
            dispatch(fetchGlobalArticles({
                ...articleParams,
                favorited: usernameParam,
            }))
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage])

    return <div>
        <Heading>
            {
                status.getProfile === "loading" &&
                <>
                    <Skeleton width={100} height={100} className="rounded border border-white border-3 mb-2"/>
                    <Skeleton width={130} height={25}/>
                    <Skeleton width={100} height={36} className="mt-2"/>
                </>
            }
            {
                (status.getProfile === "idle" && currentProfile.username) &&
                <>
                    <Image src={currentProfile.image} alt="" rounded className="border border-white border-3 mb-2" width={100} height={100}/>
                    <p className="h3 m-0">{currentProfile.username}</p>
                    <Button variant={following ? "light" : "outline-light"} className="fw-bold mt-3" onClick={buttonClickEvent} disabled={buttonDisabled}>
                        {buttonContent}
                    </Button>
                </>
            }
        </Heading>
        <ContentWrapper>
            {
                currentProfile.bio && 
                <>
                    <div className="text-center w-75 mx-auto mt-4">
                        <p className="small opacity-75 m-0">{currentProfile.bio}</p>
                    </div>
                    <hr />
                </>
            }
            {/* Tabs */}
            <Row className="my-4">
                <Col xs={12} className="d-flex justify-content-between flex-wrap mb-3">
                    <Tabs listTabs={listTabs} handleTabClick={handleTabClick} currentTab={currentTab}/>
                </Col>
                <Col xs={12}>
                    {/* list articles */}
                    <ListArticle limit={limit} currentPage={currentPage} currentTab={currentTab}/>
                    {/* Pagination */}
                    <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} pagesCount={pagesCount}/>
                </Col>
            </Row>
        </ContentWrapper>
    </div>
}   