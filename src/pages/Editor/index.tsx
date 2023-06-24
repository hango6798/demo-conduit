import { Button, Form } from "react-bootstrap";
import { NewArticle } from "models";
import * as Yup from "yup";
import { useFormik } from "formik";
import { ContentWrapper } from "components/Layout/ContentWrapper";
import "./style.scss";
import { useEffect, useMemo, useRef, useState } from "react";
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
import JoditEditor from "jodit-react";

export const Editor = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { tags } = useAppSelector((store) => store.tagsReducer);
  const { currentArticle, status } = useAppSelector(
    (store) => store.articlesReducer
  );

  const disabled = status.currentArticle === "loading";

  const defaultTags =
    currentArticle.slug === slug ? currentArticle.tagList : [];

  // Jodit
  const editor = useRef(null);
  const [joditContent, setJoditContent] = useState("");

  const config = {
    readonly: false,
    placeholder: "Write your article...",
  };

  // Effects
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
    if (slug) {
      dispatch(updateArticle({ slug, article: values })).then((res) => {
        res.meta.requestStatus === "rejected"
          ? alert("Try again!")
          : navigate(`/article/${res.payload.slug}`);
      });
    } else {
      dispatch(createArticle(values)).then((res) => {
        res.meta.requestStatus === "rejected"
          ? alert("Try again!")
          : navigate(`/article/${res.payload.slug}`);
      });
    }
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
    if (slug) {
      if (currentArticle.slug === slug) {
        setValuesFormik(currentArticle);
        setJoditContent(currentArticle.body);
      } else {
        dispatch(getCurrentArticle(slug)).then((res) => {
          if (res.meta.requestStatus === "rejected") {
            navigate("/editor");
          } else {
            setValuesFormik(res.payload);
            setJoditContent(currentArticle.body);
          }
        });
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  // Events

  const handleTagChange = (value: string[]) => {
    formik.setFieldValue("tagList", value);
  };

  const onBlurJodit = (newContent: string) => {
    formik.setFieldValue("body", newContent);
    setJoditContent(newContent);
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
          {/* <Form.Control
            as="textarea"
            rows={8}
            placeholder="Write your article (in markdown)"
            {...formik.getFieldProps("body")}
            isInvalid={touched.body && !!errors.body}
            disabled={disabled}
          /> */}
          <JoditEditor
            ref={editor}
            value={joditContent}
            config={config}
            onBlur={onBlurJodit}
          />
          <Form.Control.Feedback type="invalid">
            {errors.body && uppercaseFirstChar(errors.body)}
          </Form.Control.Feedback>
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
