import { Container } from "react-bootstrap"
import { ContentWrapper } from "../ContentWrapper/ContentWrapper";

interface Props {
    children: any;
    background?: string;
    color?: string;
}

export const Heading = ({children, background, color}:Props) => {
    return <Container fluid className={`text-center py-4 px-0 ${background ? `bg-${background}` : "bg-secondary"} ${color ? `text-${color}` : "text-white"}`}>
        <ContentWrapper>
            {children}
        </ContentWrapper>
    </Container>
}