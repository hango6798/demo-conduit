import { Container } from "react-bootstrap"

export const ContentWrapper = ({children}:any) => {
    return <Container fluid className="px-md-4 px-xs-3" style={{maxWidth: "1180px"}}>
        {children}
    </Container>
}