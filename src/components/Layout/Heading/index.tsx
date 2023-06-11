import { Container } from "react-bootstrap"


export const Heading = ({children}:any) => {
    return <Container fluid className="text-center py-4 bg-primary text-white">
        {children}
    </Container>
}