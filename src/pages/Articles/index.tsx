import React, { useEffect, useMemo, useState } from "react"
import { Col, Row } from "react-bootstrap"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { fetchFeedArticles, fetchGlobalArticles, setCurrentFavSlug } from "../../store/articlesSlice"
import { ParamsArticle } from "../../models"
import { Pagination } from "../../components/Pagination"
import { useNavigate } from "react-router-dom"
import { ContentWrapper } from "../../components/Layout/ContentWrapper/ContentWrapper"
import { Heading } from "../../components/Layout/Heading"
import { PopularTags } from "../../components/Tags/PopularTags"
import { Tabs } from "../../components/Tabs"
import { ListArticle } from "../../components/ListArticle"
import "./style.scss"
import { TagSelect } from "../../components/Tags/TagSelect"
import { fetchTags } from "../../store/tagsSlice"

export const Articles = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const {currentFavSlug} = useAppSelector(store => store.articlesReducer)
    const {articlesCount} = useAppSelector(store => store.articlesReducer)
    const {token} = useAppSelector(store => store.userReducer)
    
    // tags
    const [currentTag, setCurrentTag] = useState<string>('')
    // tabs
    const listTabs = [
        {
            name: 'feed',
            hide: !token,
            disabled: false,
            content: 'Feed',
        },
        {
            name: 'global',
            hide: false,
            disabled: false,
            content: 'Global',
        },
        {
            name: 'tag',
            hide: currentTag === '',
            disabled: true,
            content: currentTag ? `# ${currentTag[0].toUpperCase() + currentTag.slice(1)}` : '',
        }
    ]
    const defaultTab = token ? 'feed' : 'global'
    const [currentTab, setCurrentTab] = useState<string>(defaultTab)
    // pagination
    const limit = 10
    const pagesCount = useMemo(() => {
        return Math.ceil(articlesCount / limit)
    }, [articlesCount])
    const [currentPage, setCurrentPage] = useState<number>(1)
    
    const params:ParamsArticle =  {
        limit,
        offset: (currentPage - 1) * limit,
    }

    useEffect(() => {
        dispatch(fetchTags())
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    
    useEffect(() => {
        if(token) {
            if(currentFavSlug) {
                navigate(`/article/${currentFavSlug}`)
                dispatch(setCurrentFavSlug(null))
            }
            else{
                setCurrentTab('feed')
                setCurrentPage(1)
            }
        }
        else{
            setCurrentTab('global')
            setCurrentPage(1)
        }
        setCurrentTag('')
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token])

    useEffect(() => {
        if(currentTag){
            dispatch(fetchGlobalArticles({
                ...params,
                tag: currentTag,
            }))
        }
        else if(currentTab === 'global') {
            dispatch(fetchGlobalArticles(params))
        }
        else if(token && currentTab === 'feed') {
            dispatch(fetchFeedArticles(params))
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, currentTag, currentTab])

    const handleTabClick = (tab:string) => {
        setCurrentTab(tab)
        setCurrentTag('')
        setCurrentPage(1)
    }

    const handleTagClick = (tag:string) => {
        setCurrentTag(tag)
        setCurrentPage(1)
        setCurrentTab('tag')
        window.scrollTo(0,0)
    }

    const handleTagChange = (e:React.ChangeEvent<HTMLSelectElement>) => {
        setCurrentTag(e.target.value)
        setCurrentPage(1)
        if(e.target.value !== '') {
            setCurrentTab('tag')
        }
    }

    return <div>
        {
            !token &&
            <Heading>
                <div className="h1 ">conduit</div>
                <div className="h5 fw-light">A place to share your knowledge.</div>
            </Heading>
        }
        <ContentWrapper>
            <Row className="my-4">
                <Col xs={3} className="popular-tags">
                    <div className="sticky-top" style={{top: "88px"}} >
                        <PopularTags currentTag={currentTag} handleTagClick={handleTagClick}/>
                    </div>
                </Col>
                <Col xs={12} md={9}>
                    <Tabs listTabs={listTabs} handleTabClick={handleTabClick} currentTab={currentTab}/>
                    <div className="tag-select mb-4">
                        <TagSelect currentTag={currentTag} handleTagChange={handleTagChange}/>
                    </div>
                    {/* List article */}
                    <ListArticle limit={limit}/>
                    {/* Pagination */}
                    <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} pagesCount={pagesCount}/>
                </Col>
            </Row>
        </ContentWrapper>
    </div>
}