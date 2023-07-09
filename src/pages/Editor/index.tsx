import { Button, Form } from "react-bootstrap";
import { NewArticle } from "models";
import * as Yup from "yup";
import { useFormik } from "formik";
import { ContentWrapper } from "components/Layout/ContentWrapper";
import "./style.scss";
import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { fetchTags } from "store/tagsSlice";
import {
  createArticle,
  getCurrentArticle,
  updateArticle,
} from "store/articlesSlice";
import { useNavigate, useParams } from "react-router-dom";
import { Select, Space } from "antd";
import type { SelectProps } from "antd";
import checkValuesChanged from "utils/checkValuesChanged";
import uppercaseFirstChar from "utils/uppercaseFirstChar";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import showdown from "showdown";

export const Editor = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { tags } = useAppSelector((store) => store.tagsReducer);
  const { currentArticle, status } = useAppSelector(
    (store) => store.articlesReducer
  );
  const converter = new showdown.Converter();

  const disabled = useMemo(() => {
    return status.currentArticle === "loading";
  }, [status.currentArticle]);

  const defaultTags = useMemo(() => {
    return currentArticle.slug === slug ? currentArticle.tagList : [];
  }, [currentArticle.slug, currentArticle.tagList, slug]);

  // fetch Tags
  useEffect(() => {
    !tags.length && dispatch(fetchTags());
  }, [dispatch, tags]);

  const options: SelectProps["options"] = [];

  tags.forEach((tag: string) => {
    options.push({
      value: tag,
      label: tag,
    });
  });

  // formik
  const initialValues: NewArticle = {
    title: "",
    description: "",
    body: "",
    tagList: [],
  };

  const onSubmit = (values: NewArticle) => {
    slug
      ? dispatch(updateArticle({ slug, article: values })).then((res) => {
          res.meta.requestStatus === "rejected"
            ? alert("Try again!")
            : navigate(`/demo-conduit/article/${res.payload.slug}`);
        })
      : dispatch(createArticle(values)).then((res) => {
          res.meta.requestStatus === "rejected"
            ? alert("Try again!")
            : navigate(`/demo-conduit/article/${res.payload.slug}`);
        });
  };

  const validationSchema = Yup.object({
    title: Yup.string().required().trim(),
    description: Yup.string().required().trim(),
    body: Yup.string().required().trim(),
  });

  const formik = useFormik<NewArticle>({
    initialValues,
    onSubmit,
    validationSchema,
  });

  const formikDirty = useMemo(() => {
    return checkValuesChanged(formik.values, currentArticle);
  }, [currentArticle, formik.values]);

  const touched = formik.touched;
  const errors = formik.errors;

  useEffect(() => {
    const setValuesFormik = (data: NewArticle) => {
      formik.setValues({
        title: data.title,
        description: data.description,
        body: data.body,
        tagList: data.tagList,
      });
    };

    if (!slug) return;
    currentArticle.slug === slug
      ? setValuesFormik(currentArticle)
      : dispatch(getCurrentArticle(slug)).then((res) => {
          res.meta.requestStatus === "rejected"
            ? navigate("/demo-conduit/editor")
            : setValuesFormik(res.payload);
        });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  // Events

  const handleTagChange = (value: string[]) => {
    formik.setFieldValue("tagList", value);
  };

  const handleEditorChange = ({ html, text }: any) => {
    formik.setFieldValue("body", text);
  };

  return (
    <ContentWrapper>
      <Form className="my-5" onSubmit={formik.handleSubmit}>
        <p className="h3 text-center text-primary mb-2">New article</p>
        {/* Article title */}
        <Form.Group className="mb-3">
          <Form.Label>
            Title <span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            placeholder="Article title"
            size="lg"
            {...formik.getFieldProps("title")}
            isInvalid={touched.title && !!errors.title}
            disabled={disabled}
          />
          <Form.Control.Feedback type="invalid">
            {errors.title && uppercaseFirstChar(errors.title)}
          </Form.Control.Feedback>
        </Form.Group>

        {/* Article description */}
        <Form.Group className="mb-3">
          <Form.Label>
            Description <span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            placeholder="What's this article about?"
            {...formik.getFieldProps("description")}
            isInvalid={touched.description && !!errors.description}
            disabled={disabled}
          />
          <Form.Control.Feedback type="invalid">
            {errors.description && uppercaseFirstChar(errors.description)}
          </Form.Control.Feedback>
        </Form.Group>

        {/* Article body */}
        <Form.Group className="mb-3">
          <Form.Label>
            Body <span className="text-danger">*</span>
          </Form.Label>
          <MdEditor
            style={{ height: "500px" }}
            renderHTML={(text) => converter.makeHtml(text)}
            onChange={handleEditorChange}
            placeholder="Write your article (in markdown)"
            name="body"
            value={formik.values.body || ""}
            className={`${errors.body ? "border-danger" : null} rounded`}
          />
          {errors.body && (
            <div className="invalid-feedback d-block">
              {touched.body && uppercaseFirstChar(errors.body)}
            </div>
          )}
        </Form.Group>

        {/* Article tags */}
        <Form.Group className="mb-4">
          <Form.Label>
            Tags
            <br />
          </Form.Label>
          {!!tags && (
            <Space direction="vertical" style={{ width: "100%" }}>
              <Select
                size="large"
                mode="tags"
                placeholder="Please select"
                defaultValue={defaultTags}
                value={formik.values.tagList}
                onChange={handleTagChange}
                style={{ width: "100%" }}
                options={options}
                disabled={disabled}
              />
            </Space>
          )}
        </Form.Group>

        {/* Submit button */}
        <Button
          className="mx-auto d-block"
          size="lg"
          type="submit"
          disabled={disabled || !formikDirty}
        >
          Publish Article
        </Button>
      </Form>
    </ContentWrapper>
  );
};
