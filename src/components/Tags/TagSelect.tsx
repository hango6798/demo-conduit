import React from "react"
import { useAppSelector } from "../../store/hooks"
import { Form } from "react-bootstrap"

interface Props {
    currentTag: string;
    handleTagChange: (e:React.ChangeEvent<HTMLSelectElement>) => void;
}

export const TagSelect = ({currentTag, handleTagChange} : Props) => {
    const {tags} = useAppSelector(store => store.tagsReducer)

    return <Form.Select onChange={handleTagChange} value={currentTag} style={{height: "42px", marginBottom: "10px"}}>
        <option disabled value="">Tags</option>
        {
            tags.map((tag:string, index:number) => {
                return <option key={index} value={tag}>{tag}</option>
            })
        }
    </Form.Select>
}
