
import './style.scss'
import { Button, Modal, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import { Login, NewUser } from '../../models';
import { useFormik } from "formik"
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { register, login, setShowPopup, setPopupType } from '../../store/userSlice';
import React, { useEffect } from 'react';

export const UserPopup = () => {
    const dispatch = useAppDispatch()
    const {error, token, status, popupType} = useAppSelector(store => store.userReducer)
    
    const handleClose = () => dispatch(setShowPopup(false))
    const isRegister = popupType === 'register'

    const title = isRegister ? 'Sign up' : 'Sign in'
    const linkText = isRegister ? 'Have an account?' : 'Need an account?'

    const changePopupType = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault()
        dispatch(setPopupType(isRegister ? 'login' : 'register'))
    }

    const disabled = isRegister ? status.register === "loading" : status.login === "loading"

    // formik

    const formikRegister = useFormik<NewUser>({
        initialValues: {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
        onSubmit: (values: NewUser) => {
            const newUser: NewUser = {
                username: values.username,
                email: values.email,
                password: values.password,
            }
            dispatch(register(newUser))
        },
        validationSchema: Yup.object({
            username: Yup.string().required(),
            email: Yup.string().required().email(),
            password: Yup.string().required().min(6,'Your password is too short!').max(20, 'Your password is too long!'),
            confirmPassword: Yup.string().required().oneOf([Yup.ref('password')],'Your passwords do not match.')
        }),
    })

    const formikLogin = useFormik<Login>({
        initialValues: {
            email: '',
            password: '',
        },
        onSubmit: (values: Login) => {
            const loginInfo: Login = {
                email: values.email,
                password: values.password,
            }
            dispatch(login(loginInfo))
        },
        validationSchema: Yup.object({
            email: Yup.string().required().email(),
            password: Yup.string().required(),
        })
    })

    const registerErrors = formikRegister.errors
    const registerTouched = formikRegister.touched
    const loginErrors = formikLogin.errors
    const loginTouched = formikLogin.touched

    useEffect(() => {
        !!token && dispatch(setShowPopup(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token])

    return <>
        <Modal show={true} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>
                    {title}
                </Modal.Title>
                <Link to="" onClick={changePopupType}>{linkText}</Link>
            </Modal.Header>
            {
                isRegister ? 
                // Register Form
                <Form onSubmit={formikRegister.handleSubmit}>
                    <Modal.Body>
                    {/* User name */}
                        <Form.Group className="mb-3">
                            <Form.Label>Username</Form.Label>
                            <Form.Control placeholder="Username" {...formikRegister.getFieldProps('username')} isInvalid={registerTouched.username && !!registerErrors.username} disabled={disabled}/>
                            <Form.Control.Feedback type="invalid">
                                {registerErrors.username}
                            </Form.Control.Feedback>
                        </Form.Group>
                    {/* Email */}
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" placeholder="Email" {...formikRegister.getFieldProps('email')} isInvalid={registerTouched.email && !!registerErrors.email} disabled={disabled}/>
                            <Form.Control.Feedback type="invalid">
                                {registerErrors.email}
                            </Form.Control.Feedback>
                        </Form.Group>
                    {/* Password */}
                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>

                            <Form.Control type="password" placeholder="Password" {...formikRegister.getFieldProps('password')} isInvalid={registerTouched.password && !!registerErrors.password}  disabled={disabled}/>

                            <Form.Control.Feedback type="invalid">
                                {registerErrors.password}
                            </Form.Control.Feedback>
                        </Form.Group>
                    {/* Confirm Password */}
                        <Form.Group className="mb-3">
                            <Form.Label>Confirm Password</Form.Label>
                            
                            <Form.Control type="password" placeholder="Password" {...formikRegister.getFieldProps('confirmPassword')} isInvalid={registerTouched.confirmPassword && !!registerErrors.confirmPassword} disabled={disabled}/>

                            <Form.Control.Feedback type="invalid">
                                {registerErrors.confirmPassword}
                            </Form.Control.Feedback>
                        </Form.Group>
                        {error.register && <div className="d-block text-danger mt-2 text-center">{error.register}</div>}

                    </Modal.Body>
                    <Modal.Footer>
                    {/* Submit Button register form*/}
                        <Button variant="primary" type="submit" disabled={disabled}>
                            {title}
                        </Button>
                    </Modal.Footer>
                </Form>
                :
                // Login Form
                <Form onSubmit={formikLogin.handleSubmit}>
                    <Modal.Body>
                        {/* Email */}
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" placeholder="Email" {...formikLogin.getFieldProps('email')} isInvalid={loginTouched.email && !!loginErrors.email} disabled={disabled}/>
                            <Form.Control.Feedback type="invalid">
                                {loginErrors.email}
                            </Form.Control.Feedback>
                        </Form.Group>
                        {/* Password */}
                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                        
                            <Form.Control type="password" placeholder="Password" {...formikLogin.getFieldProps('password')} isInvalid={loginTouched.password && !!loginErrors.password} disabled={disabled}/>

                            <Form.Control.Feedback type="invalid">
                                {loginErrors.password}
                            </Form.Control.Feedback>
                        </Form.Group>
                        {error.login && <div className="d-block text-danger mt-2 text-center">{error.login}</div>}

                    </Modal.Body>

                    <Modal.Footer>
                        {/* submit button login form */}
                        <Button variant="primary" type="submit" disabled={disabled}>
                            {title}
                        </Button>
                    </Modal.Footer>
                </Form>
            }
        </Modal>
    </>
}