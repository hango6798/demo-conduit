import { Container } from "react-bootstrap"

export const ContentWrapper = ({children}:any) => {
    return <Container fluid className="px-md-4 px-xs-3">
        {children}
    </Container>
}