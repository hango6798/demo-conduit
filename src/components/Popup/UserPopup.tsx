
import './style.scss'
import { Button, Modal, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import { Login, NewUser } from '../../models';
import { useFormik } from "formik"

interface Props {
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
    popupType: string;
    setPopupType: React.Dispatch<React.SetStateAction<string>>
}

export const UserPopup = ({setShow, popupType, setPopupType}:Props) => {
    
    const handleClose = () => setShow(false)
    const isRegister = popupType === 'register'

    const title = isRegister ? 'Sign up' : 'Sign in'
    const linkText = isRegister ? 'Have an account?' : 'Need an account?'

    const changePopupType = () => {
        isRegister ? setPopupType('login') : setPopupType('register')
    }

    // Formik
    const initialValues: Login | NewUser = isRegister ? {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    } 
    : {
        email: '',
        password: '',
    }

    const onSubmit = (values: Login | NewUser) => {
        console.log(values)
    }

    const validationSchema = isRegister ? Yup.object({
        username: Yup.string().required(),
        email: Yup.string().required().email(),
        password: Yup.string().required().min(6,'Your password is too short!').max(20, 'Your password is too long!'),
        confirmPassword: Yup.string().required().oneOf([Yup.ref('password')],'Your passwords do not match.')
    })
    : Yup.object({
        email: Yup.string().required().email(),
        password: Yup.string().required(),
    })

    const formik = useFormik<Login | NewUser>({
        initialValues,
        onSubmit,
        validationSchema,
    })

    const errors = formik.errors
    const touched = formik.touched

    return <>
        <Modal show={true} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>
                    {title}
                </Modal.Title>
                <Link to="" onClick={changePopupType}>{linkText}</Link>
            </Modal.Header>


            <Form onSubmit={formik.handleSubmit}>
                <Modal.Body>

                        {
                            isRegister && 
                            <Form.Group className="mb-3">
                                <Form.Label>Username</Form.Label>
                                <Form.Control placeholder="Username" {...formik.getFieldProps('username')}/>
                            </Form.Group>
                        }

                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" placeholder="Email" {...formik.getFieldProps('email')}/>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" {...formik.getFieldProps('password')}/>
                        </Form.Group>

                        {
                            isRegister && 
                            <Form.Group className="mb-3">
                                <Form.Label>Confirm Password</Form.Label>
                                <Form.Control type="password" placeholder="Password" {...formik.getFieldProps('confirmPassword')}/>
                            </Form.Group>
                        }
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="primary" type="submit">
                        {title}
                    </Button>
                </Modal.Footer>

            </Form>
        </Modal>
    </>
}