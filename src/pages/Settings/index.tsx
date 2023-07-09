import { Button, Form, Image } from "react-bootstrap";
import { ContentWrapper } from "components/Layout/ContentWrapper";
import "./style.scss";
import { useAppDispatch, useAppSelector } from "store/hooks";
import Skeleton from "react-loading-skeleton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useMemo, useState } from "react";
import axios from "axios";
import { updateUser } from "store/userSlice";
import { useNavigate } from "react-router-dom";
import checkValuesChanged from "utils/checkValuesChanged";
import getBase64 from "utils/getBase64";

export const Settings = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { user, status } = useAppSelector((store) => store.userReducer);
  const disabled = status.updateUser === "loading";

  const [imgUrlLoading, setImgUrlLoading] = useState<boolean>(false);

  // Formik
  const initialValues = {
    image: user?.image,
    username: user?.username,
    bio: user?.bio || "",
    email: user?.email,
    newPassword: "",
    confirmPassword: "",
  };
  const onSubmit = (values: any) => {
    dispatch(updateUser(values)).then((res) => {
      res.meta.requestStatus === "rejected"
        ? alert("Try again!")
        : navigate(`/demo-conduit/profiles/@${values.username}`);
    });
  };

  const validate = (values: any) => {
    const errors: any = {};
    if (values.newPassword !== "" && values.confirmPassword === "") {
      errors.confirmPassword = "Please confirm password!";
    }
    return errors;
  };

  const validationSchema = Yup.object({
    image: Yup.string().required(),
    username: Yup.string().required().trim(),
    bio: Yup.string().max(100),
    email: Yup.string().email().required().trim(),
    newPassword: Yup.string()
      .trim()
      .min(6, "Your password is too short!")
      .max(20, "Your password is too long!"),
    confirmPassword: Yup.string()
      .trim()
      .oneOf([Yup.ref("newPassword")], "Your passwords do not match."),
  });
  const formik = useFormik({
    initialValues,
    onSubmit,
    validate,
    validationSchema,
  });

  const formikDirty: boolean = useMemo(() => {
    return checkValuesChanged(formik.values, initialValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values]);
  const errors = formik.errors;
  const touched = formik.touched;

  // Change avatar
  function handleChangeAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    const payload = new FormData();

    if (files && files.length) {
      getBase64(files[0], (base64File: any) => {
        const base64Img = base64File.toString().split(",")[1];
        payload.append("image", base64Img);
        setImgUrlLoading(true);
        axios
          .post(
            `https://api.imgbb.com/1/upload?key=80523bcf4b9e9bcc56c484eedd12954e`,
            payload
          )
          .then((res) => {
            formik.setFieldValue("image", res.data.data.image.url);
          })
          .catch((error) => {
            console.log(error);
            alert("Try again!");
          })
          .finally(() => {
            setImgUrlLoading(false);
          });
      });
    }
  }

  return (
    <ContentWrapper>
      <Form className="settings-form mb-5 mt-5" onSubmit={formik.handleSubmit}>
        <p className="h4 text-center text-primary mb-2">Your Settings</p>
        {/* Avatar */}
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label className="d-inline-block">Avatar</Form.Label>
          <br />
          <Form.Label className="text-center" controlid="uploadAvatar">
            <div
              className={`avatar border border-secondary border-3 rounded ${
                (imgUrlLoading || disabled) && "disabled"
              }`}
            >
              {formik.values.image ? (
                <div className="position-relative image">
                  <Image src={formik.values.image} width="100%" height="100%" />
                  <FontAwesomeIcon icon={faCamera} />
                </div>
              ) : (
                <Skeleton
                  width="100%"
                  height="100%"
                  className="rounded d-block"
                />
              )}
            </div>
          </Form.Label>
          <br />
          <Form.Control
            type="file"
            hidden
            {...formik.getFieldProps("image")}
            value=""
            isInvalid={!!errors.image && touched.image}
            onChange={handleChangeAvatar}
            disabled={disabled}
          />
          <Form.Control.Feedback type="invalid">
            {errors.image}
          </Form.Control.Feedback>
        </Form.Group>

        {/* Username */}
        <Form.Group className="mb-3">
          <Form.Label>
            Username <span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Username"
            {...formik.getFieldProps("username")}
            isInvalid={!!errors.username && touched.username}
            disabled={disabled}
          />
          <Form.Control.Feedback type="invalid">
            {errors.username}
          </Form.Control.Feedback>
        </Form.Group>

        {/* Bio */}
        <Form.Group className="mb-3">
          <Form.Label>Bio</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Short bio about you"
            {...formik.getFieldProps("bio")}
            isInvalid={!!errors.bio && touched.bio}
            disabled={disabled}
          />
          <Form.Control.Feedback type="invalid">
            {errors.bio}
          </Form.Control.Feedback>
        </Form.Group>

        {/* Email */}
        <Form.Group className="mb-3">
          <Form.Label>
            Email <span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            type="email"
            placeholder="Email"
            {...formik.getFieldProps("email")}
            isInvalid={!!errors.email && touched.email}
            disabled={disabled}
          />
          <Form.Control.Feedback type="invalid">
            {errors.email}
          </Form.Control.Feedback>
        </Form.Group>

        <p className="h4 mt-4 text-center text-primary mb-2">Change Password</p>

        {/* New Password */}
        <Form.Group className="mb-3">
          <Form.Label>New password</Form.Label>
          <Form.Control
            type="password"
            placeholder="New Password"
            {...formik.getFieldProps("newPassword")}
            isInvalid={!!errors.newPassword && touched.newPassword}
            disabled={disabled}
          />
          <Form.Control.Feedback type="invalid">
            {errors.newPassword}
          </Form.Control.Feedback>
        </Form.Group>

        {/* Confirm Password */}
        <Form.Group className="mb-4">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm Password"
            {...formik.getFieldProps("confirmPassword")}
            isInvalid={!!errors.confirmPassword && touched.confirmPassword}
            disabled={disabled}
          />
          <Form.Control.Feedback type="invalid">
            {errors.confirmPassword}
          </Form.Control.Feedback>
        </Form.Group>
        <Button
          className="mx-auto d-block"
          size="lg"
          type="submit"
          disabled={disabled || !formikDirty}
        >
          Update Settings
        </Button>
      </Form>
    </ContentWrapper>
  );
};
