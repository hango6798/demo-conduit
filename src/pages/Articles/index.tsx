import { useEffect, useState } from "react"
import { Col, ListGroup, Nav, Row, Form } from "react-bootstrap"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { fetchFeedArticles, fetchGlobalArticles, setCurrentFavSlug } from "../../store/ArticlesSlice"
import { fetchTags } from "../../store/tagsSlice"
import { ArticleItem } from "../../components/ArticleItem"
import { Article, ParamsArticle } from "../../models"
import './style.scss'
import { Pagination } from "../../components/Pagination"
import { ArticleSkeleton } from "../../components/ArticleItem/ArticleSkeleton"
import { useNavigate } from "react-router-dom"

type Tab = 'feed' | 'global' | 'tag'

export const Articles = () => {
    const navigate = useNavigate()
    const {currentFavSlug} = useAppSelector(store => store.articlesReducer)
    
    const dispatch = useAppDispatch()
    const {feedArticles, globalArticles, globalStatus, feedStatus, globalArticlesCount, feedArticlesCount} = useAppSelector(store => store.articlesReducer)
    const {token} = useAppSelector(store => store.userReducer)
    // tags
    const {tags} = useAppSelector(store => store.tagsReducer)
    const [currentTag, setCurrentTag] = useState<string>('')
    // tabs
    const [currentTab, setCurrentTab] = useState<Tab>('global')
    const articles:Article[] = currentTab === 'feed' ? feedArticles : globalArticles
    const articleStatus = currentTab === 'feed' ? feedStatus : globalStatus
    // pagination
    const limit = 10
    const pagesCount = currentTab === 'feed' ? Math.ceil(feedArticlesCount / limit) : Math.ceil(globalArticlesCount / limit)
    const [currentPage, setCurrentPage] = useState<number>(1)
    
    const params:ParamsArticle =  {
        limit,
        offset: (currentPage - 1) * limit,
    }

    useEffect(() => {

        dispatch(fetchTags())

        if(token) {
            if(currentFavSlug) {
                navigate(`/article/${currentFavSlug}`)
                dispatch(setCurrentFavSlug(null))
            }
            else{
                setCurrentTab('feed')
                dispatch(fetchFeedArticles(params))
            }
        }
        else{
            setCurrentTab('global')
            dispatch(fetchGlobalArticles(params))
        }
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
    }, [currentPage, currentTag])

    const handleTabClick = (tab:Tab) => {
        setCurrentTab(tab)
        setCurrentTag('')
        setCurrentPage(1)
        if(tab === 'global') {
            dispatch(fetchGlobalArticles({
                ...params,
                offset: 0
            }))
        }
        else if(token && tab === 'feed') {
            dispatch(fetchFeedArticles({
                ...params,
                offset: 0
            }))
        }
    }

    const setActive = (tab:Tab) => {
        return !currentTag && tab === currentTab
    }

    const handleSelectChange = (e:React.ChangeEvent<HTMLSelectElement>) => {
        setCurrentTag(e.target.value)
        setCurrentPage(1)
        if(e.target.value !== ''){
            setCurrentTab('tag')
            dispatch(fetchGlobalArticles({
                ...params,
                offset: 0,
                tag: e.target.value
            }))
        }
    }

    return <Row className="my-4">
        <Col xs={12}>
            <Nav variant="pills" defaultActiveKey="/home" className="border-0 d-flex justify-content-between tabs">
                
                <div className="d-flex">
                    {
                        token &&
                        <Nav.Item className="me-3">
                            <Nav.Link onClick={() => handleTabClick('feed')} active={setActive('feed')}>Feed</Nav.Link>
                        </Nav.Item>
                    }
                    <Nav.Item className="me-3">
                        <Nav.Link onClick={() => handleTabClick('global')} active={setActive('global')}>Global</Nav.Link>
                    </Nav.Item>
                    {
                        currentTag &&
                        <Nav.Item className="me-3">
                            <Nav.Link active>
                                # {currentTag}
                            </Nav.Link>
                        </Nav.Item>
                    }
                </div>
                 
                <Nav.Item>
                    <Form.Select className="w-100" onChange={handleSelectChange} value={currentTag}>
                        <option disabled value="">Tags</option>
                        {
                            tags.map((tag:string, index:number) => {
                                return <option key={index} value={tag}>{tag}</option>
                            })
                        }
                    </Form.Select>
                </Nav.Item>
            </Nav>
        </Col>
        <Col xs={12} className="mt-3">
            {/* List article */}
            <ListGroup className="border-0">
                <Row>
                    {
                        articleStatus === "failed" &&
                        <div className="text-center">Get Data Failed!</div>
                    }
                    {
                        articleStatus === "loading" && 
                        Array(limit).fill(0).map((item, index:number) => {
                            return <Col xs={12} md={6} key={index} className="mb-3">
                                <ArticleSkeleton/>
                            </Col>
                        })
                    }
                    {
                        articles.length === 0 ? <div className="text-center">No articles are here... yet.</div>
                        : articleStatus === "idle" && articles.map((article:Article, index:number) => {
                            return <Col xs={12} md={6} key={index} className="mb-3">
                                <ArticleItem article={article} currentTab={currentTab} currentPage={currentPage} currentTag={currentTag}/>
                            </Col>
                        })
                    }
                </Row>
            </ListGroup>
            {/* Pagination */}
            {
                pagesCount > 1 &&
                <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} pagesCount={pagesCount}/>
            }
        </Col>
    </Row>
}