
import { Pagination as PagiBootstrap } from "react-bootstrap"

interface Props {
    currentPage: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    pagesCount: number;
}

export const Pagination = ({currentPage, setCurrentPage, pagesCount} : Props) => {

    return pagesCount > 1 ? <PagiBootstrap className="d-flex justify-content-center mt-3">
        <PagiBootstrap.First disabled={currentPage === 1} onClick={() => setCurrentPage(1)}/>
        <PagiBootstrap.Prev disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}/>
        {
            currentPage > 3 &&
            <PagiBootstrap.Item onClick={() => setCurrentPage(1)}>{1}</PagiBootstrap.Item>
        }
        {
            currentPage > 4 &&
            <PagiBootstrap.Ellipsis onClick={() => setCurrentPage(3)}/>
        }
        {
            currentPage > 2 &&
            <PagiBootstrap.Item onClick={() => setCurrentPage(currentPage - 2)}>{currentPage - 2}</PagiBootstrap.Item>
        }
        {
            currentPage > 1 &&
            <PagiBootstrap.Item onClick={() => setCurrentPage(currentPage - 1)}>{currentPage - 1}</PagiBootstrap.Item>
        }
        <PagiBootstrap.Item active>{currentPage}</PagiBootstrap.Item>
        {
            currentPage < pagesCount - 1 &&
            <PagiBootstrap.Item onClick={() => setCurrentPage(currentPage + 1)}>{currentPage + 1}</PagiBootstrap.Item>
        }
        {
            currentPage < pagesCount - 2 &&
            <PagiBootstrap.Item onClick={() => setCurrentPage(currentPage + 2)}>{currentPage + 2}</PagiBootstrap.Item>
        }
        {
            currentPage < pagesCount - 3 &&
            <PagiBootstrap.Ellipsis onClick={() => setCurrentPage(pagesCount - 3)}/>
        }
        {
            currentPage < pagesCount &&
            <PagiBootstrap.Item onClick={() => setCurrentPage(pagesCount)}>{pagesCount}</PagiBootstrap.Item>
        }
        <PagiBootstrap.Next onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === pagesCount}/>
        <PagiBootstrap.Last onClick={() => setCurrentPage(pagesCount)} disabled={currentPage === pagesCount}/>
    </PagiBootstrap>
    : null
}