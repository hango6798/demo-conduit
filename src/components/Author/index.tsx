import { Link } from "react-router-dom"
import { Author as AuthorType } from "../../models"
import { Image } from "react-bootstrap"

interface Props {
    author: AuthorType;
    createdTime: string;
    variant: "light" | "dark";
}

export const Author = ({author, createdTime, variant}: Props) => {
    const authorUrl = `/profiles/@${author.username}`
    const dark = variant === "dark"

    const handleAuthorClick = () => {
        window.scrollTo(0,0)
    }

    return <div className="d-flex align-items-center">
        <Link to={authorUrl} className="me-2" onClick={handleAuthorClick}>
            <Image src={author.image} alt="" rounded width={40} height={40} className={`${dark ? "border border-white border-2" : null}`}/>
        </Link>
        <div>
            <Link to={authorUrl} className={`${dark ? "text-white" : "text-dark"} fw-medium authorName`} onClick={handleAuthorClick}>
                {author.username}
            </Link>
            <p className={`${dark ? "text-light opacity-50" : "text-secondary"} small mb-0`}>{createdTime}</p>
        </div>
    </div>
}