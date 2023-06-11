import React, { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { fetchTags } from "../../store/tagsSlice"
import { Form } from "react-bootstrap"

interface Props {
    currentTag: string;
    setCurrentTag: React.Dispatch<React.SetStateAction<string>>;
    handleTagChange: (e:React.ChangeEvent<HTMLSelectElement>) => void;
}

export const Tags = ({currentTag, setCurrentTag, handleTagChange} : Props) => {
    const dispatch = useAppDispatch()
    const {tags} = useAppSelector(store => store.tagsReducer)

    useEffect(() => {
        dispatch(fetchTags())
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return <Form.Select className="w-100" onChange={handleTagChange} value={currentTag} style={{height: "42px", marginBottom: "10px"}}>
        <option disabled value="">Tags</option>
        {
            tags.map((tag:string, index:number) => {
                return <option key={index} value={tag}>{tag}</option>
            })
        }
    </Form.Select>
}
