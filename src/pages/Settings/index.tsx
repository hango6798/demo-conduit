import { Button, Form, Image } from "react-bootstrap"
import { ContentWrapper } from "../../components/Layout/ContentWrapper/ContentWrapper"
import "./style.scss"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import Skeleton from "react-loading-skeleton"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCamera } from "@fortawesome/free-solid-svg-icons"
import * as Yup from "yup"
import { useFormik } from "formik"
import { useEffect, useState } from "react"
import axios from "axios"
import { updateUser } from "../../store/userSlice"
import { useNavigate } from "react-router-dom"

export const Settings = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const {user, status} = useAppSelector(store => store.userReducer)
    const disabled = status.updateUser === 'loading'

    const [imageUrl, setImageUrl] = useState<string>(user.image)
    const defaultValues = {
        image: user.image,
        username: user.username,
        bio: user.bio,
        email: user.email,
        newPassword: '',
        confirmPassword: '',
    }
    const initialValues = defaultValues
    const onSubmit = (values:any) => {
        const newInfo = {
            image: imageUrl,
            username: values.username,
            bio: values.bio,
            email: values.email,
            password: values.newPassword,
        }
        dispatch(updateUser(newInfo))
        status.updateUser === "idle" && navigate(`/profiles/@${values.username}`)
        status.updateUser === "failed" && alert('Something goes wrong, please reload website and try again!')
    }
    const validationSchema = Yup.object({
        image: Yup.string().required(),
        username: Yup.string().required(),
        bio: Yup.string().max(100),
        email: Yup.string().email().required(),
        newPassword: Yup.string().min(6,'Your password is too short!').max(20, 'Your password is too long!'),
        confirmPassword: Yup.string().oneOf([Yup.ref('newPassword')],'Your passwords do not match.')
    })
    const formik = useFormik({
        initialValues,
        onSubmit,
        validationSchema,
    })
    useEffect(() => {
        setImageUrl(user.image)
        formik.setValues(defaultValues)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])
    const errors = formik.errors
    const touched = formik.touched

    const handleChangeAvatar = (e:React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        const payload = new FormData()
        if(files && files.length){
            payload.append('image', files[0])
        }
        const res = axios.post(`https://api.imgbb.com/1/upload?expiration=600&key=80523bcf4b9e9bcc56c484eedd12954e`, payload)
        res.then(data => {
            setImageUrl(data.data.data.image.url)
        })
        .catch((error) => {
            console.log(error)
            alert("Try again!")
        })
    }

    return <ContentWrapper>
        <Form className="settings-form mb-5 mt-5" onSubmit={formik.handleSubmit}>
            <p className="h4 text-center text-primary mb-2">
                Your Settings
            </p>
            <Form.Group controlId="formFile" className="mb-3">
                <Form.Label className="d-inline-block">
                    Avatar
                </Form.Label>
                <br />
                <Form.Label className="text-center" controlid="uploadAvatar">
                    <div className="avatar border border-secondary border-3 rounded">
                        {
                            imageUrl ? <div className="position-relative">
                                <Image src={imageUrl} />
                                <FontAwesomeIcon icon={faCamera}/>
                            </div>
                            : <Skeleton  width="100%" height="100%" className="rounded d-block"/>
                        }
                    </div>
                </Form.Label><br />
                <Form.Control type="file" hidden {...formik.getFieldProps('image')} value="" isInvalid={!!errors.image && touched.image} onChange={handleChangeAvatar} disabled={disabled}/>
                <Form.Control.Feedback type="invalid">
                    {errors.image}
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control type="username" placeholder="Username" {...formik.getFieldProps('username')} isInvalid={!!errors.username && touched.username} disabled={disabled}/>
                <Form.Control.Feedback type="invalid">
                    {errors.username}
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Bio</Form.Label>
                <Form.Control as="textarea" rows={3} placeholder="Short bio about you" {...formik.getFieldProps('bio')} isInvalid={!!errors.bio && touched.bio} disabled={disabled}/>
                <Form.Control.Feedback type="invalid">
                    {errors.bio}
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" placeholder="Email" {...formik.getFieldProps('email')} isInvalid={!!errors.email && touched.email} disabled={disabled}/>
                <Form.Control.Feedback type="invalid">
                    {errors.email}
                </Form.Control.Feedback>
            </Form.Group>
            <p className="h4 mt-4 text-center text-primary mb-2">
                Change Password
            </p>
            <Form.Group className="mb-3">
                <Form.Label>New password</Form.Label>
                <Form.Control type="password" placeholder="New Password" {...formik.getFieldProps('newPassword')} isInvalid={!!errors.newPassword && touched.newPassword} disabled={disabled}/>
                <Form.Control.Feedback type="invalid">
                    {errors.newPassword}
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-4">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control type="password" placeholder="Confirm Password" {...formik.getFieldProps('confirmPassword')} isInvalid={!!errors.confirmPassword && touched.confirmPassword} disabled={disabled}/>
                <Form.Control.Feedback type="invalid">
                    {errors.confirmPassword}
                </Form.Control.Feedback>
            </Form.Group>
            <Button className="mx-auto d-block" size="lg" type="submit" disabled={disabled}>Update Settings</Button>
        </Form>
    </ContentWrapper>
}