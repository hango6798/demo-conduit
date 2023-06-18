import Skeleton from "react-loading-skeleton"

export const AuthorSkeleton = () => {
    return <div className="d-flex align-items-center">
        <Skeleton width={40} height={40} className="me-2 rounded"/>
        <div>
            <Skeleton width={110} height={20} count={2}/>
        </div>
    </div>
}