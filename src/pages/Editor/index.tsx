import { Button, Col, Form, Row } from "react-bootstrap"
import { NewArticle } from "../../models"
import * as Yup from 'yup'
import { useFormik } from "formik"
import { ContentWrapper } from "../../components/Layout/ContentWrapper/ContentWrapper"
import './style.scss'
import { TagSelect } from "../../components/Tags/TagSelect"
import React, { useEffect, useRef, useState } from "react"
import { useAppDispatch } from "../../store/hooks"
import { fetchTags } from "../../store/tagsSlice"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons"
import { createArticle } from "../../store/articlesSlice"
import { useNavigate } from "react-router-dom"

export const Editor = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const [currentTag, setCurrentTag] = useState<string>('')
    const [tagInput, setTagInput] = useState<string>('')

    const tagInputRef = useRef<HTMLInputElement>(null)
    const [tagDuplicated, setTagDuplicated] = useState<boolean>(false)

    // Effects
    useEffect(() => {
        dispatch(fetchTags())
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // formik
    const initialValues: NewArticle = {
        title: '',
        description: '',
        body: '',
        tagList: [],
    }

    const onSubmit = (values: NewArticle) => {
        const newArticle: NewArticle = values
        dispatch(createArticle(newArticle))
        .then((data) => {
            navigate(`/article/${data.payload.slug}`)
        })
        .catch(() => {
            alert("Try again!")
        })
    }

    const validationSchema = Yup.object({
        title: Yup.string().required(),
        description: Yup.string().required(),
        body: Yup.string().required(),
    })

    const formik = useFormik<NewArticle>({
        initialValues,
        onSubmit,
        validationSchema
    })

    const touched = formik.touched
    const errors = formik.errors

    // Events
    const handleTagChange = (e:React.ChangeEvent<HTMLSelectElement>) => {
        setCurrentTag(e.target.value)
        const tagList = formik.values.tagList
        if(!tagList.includes(e.target.value)){
            formik.setFieldValue('tagList', [
                ...tagList,
                e.target.value
            ])
        }
        else{
            setTagDuplicated(true)
            setTimeout(() => {
                setTagDuplicated(false)
            }, 1000)
        }
        setCurrentTag('')
    }

    const addTag = () => {
        const tagList = formik.values.tagList
        if(!!tagInput){
            if(!tagList.includes(tagInput)){
                formik.setFieldValue('tagList', [
                    ...tagList,
                    tagInput
                ])
            }
            else{
                setTagDuplicated(true)
                setTimeout(() => {
                    setTagDuplicated(false)
                }, 1000)
            }
            setTagInput('')
            if(tagInputRef.current){
                tagInputRef.current.focus()
            }
        }
    }

    const handleChangeTagInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTagInput(e.target.value)
    }

    const handleKeydownInputTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if(e.key === "Enter"){
            e.preventDefault()
            addTag()
        }
    }

    const handleDeleteTag = (tag: string) => {
        const tagList = [...formik.values.tagList]
        const id = tagList.findIndex((item:string) => item === tag)
        if( id !== -1 ) {
            tagList.splice(id,1)
            formik.setFieldValue('tagList', tagList)
        }
    }

    const uppercaseFirstChar = (string:string) => {
        return string[0].toUpperCase() + string.slice(1, string.length)
    }


    return <ContentWrapper>
        <Form className="my-5" onSubmit={formik.handleSubmit}>
            <p className="h3 text-center text-primary mb-2">
                New article
            </p>
            {/* Article title */}
            <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control placeholder="Article title" size="lg" {...formik.getFieldProps("title")} isInvalid={touched.title && !!errors.title}/>
                <Form.Control.Feedback type="invalid">
                    {errors.title && uppercaseFirstChar(errors.title)}
                </Form.Control.Feedback>
            </Form.Group>

            {/* Article description */}
            <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control placeholder="What's this article about?" {...formik.getFieldProps("description")} isInvalid={touched.description && !!errors.description} />
                <Form.Control.Feedback type="invalid">
                    {errors.description && uppercaseFirstChar(errors.description)}
                </Form.Control.Feedback>
            </Form.Group>

            {/* Article body */}
            <Form.Group className="mb-3">
                <Form.Label>Body</Form.Label>
                <Form.Control as="textarea" rows={8} placeholder="Write your article (in markdown)" {...formik.getFieldProps("body")} isInvalid={touched.body && !!errors.body} />
                <Form.Control.Feedback type="invalid">
                    {errors.body && uppercaseFirstChar(errors.body)}
                </Form.Control.Feedback>
            </Form.Group>

            {/* Article tags */}
            <Form.Group className="mb-4">
                <Form.Label>
                    Tags<br />
                    <small className="fw-400 opacity-50">(Select tag or enter new tag)</small>
                </Form.Label>
                <Row>
                    <Col>
                        <TagSelect currentTag={currentTag} handleTagChange={handleTagChange}/>
                        <div className="d-flex align-items-center w-100 new-tag">
                            <Form.Control placeholder="Add tag..." onChange={handleChangeTagInput} value={tagInput} ref={tagInputRef} onKeyDown={handleKeydownInputTag}/>
                            <Button onClick={addTag}>Add tag</Button>
                        </div>
                        <span  className="text-success mt-2 small d-block" style={{height: "20px"}}>
                            {
                                tagDuplicated &&
                                "This tag is already added!"
                            }
                        </span>
                    </Col>  
                    <Col>
                        <div className="border rounded p-2 pb-1 list-tag">
                            <p className="fw-medium opacity-75 m-0 mb-2">List tags:</p>
                            {
                                !!formik.values.tagList.length ?
                                <ul className="d-flex flex-wrap">
                                    {
                                        formik.values.tagList.map((tag:string, index:number) => {
                                            return <li key={index} className="mb-3">
                                                <span className="py-1 px-2 rounded small text-light bg-secondary">{tag}</span>
                                                <span className="btn-delete text-danger" onClick={() => handleDeleteTag(tag)}><FontAwesomeIcon icon={faTimesCircle}/></span>
                                            </li>
                                        })
                                    }
                                </ul>
                                : <span className="opacity-50">Empty...</span>
                            }
                        </div>
                    </Col>  
                </Row>
            </Form.Group>
            
            {/* Submit button */}
            <Button className="mx-auto d-block" size="lg" type="submit">Publish Article</Button>
        </Form>
    </ContentWrapper>
}