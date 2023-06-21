import { Button, Form } from "react-bootstrap";
import { NewArticle } from "models";
import * as Yup from "yup";
import { useFormik } from "formik";
import { ContentWrapper } from "components/Layout/ContentWrapper";
import "./style.scss";
import { useEffect, useState } from "react";
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

export const Editor = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { tags } = useAppSelector((store) => store.tagsReducer);
  const { currentArticle, status } = useAppSelector(
    (store) => store.articlesReducer
  );
  const [listTags, setListTags] = useState<string[]>([]);

  const disabled = status.currentArticle === "loading";

  const defaultTags =
    currentArticle.slug === slug ? currentArticle.tagList : [];

  // Effects
  useEffect(() => {
    dispatch(fetchTags());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    const article: NewArticle = values;
    const compareValues = (obj1: any, obj2: any) => {
      for (let key of Object.keys(obj1)) {
        if (obj1[key] !== obj2[key]) {
          return false;
        }
      }
      return true;
    };
    if (slug) {
      if (compareValues(values, currentArticle)) {
        navigate(`/article/${slug}`);
        return;
      }
      dispatch(updateArticle({ slug, article }))
        .then((data: any) => {
          console.log(data.payload.slug);
          // navigate(`/article/${data.payload.slug}`);
        })
        .catch((error) => {
          console.log(error);
          alert("Try again!");
        });
    } else {
      dispatch(createArticle(article))
        .then((data) => {
          navigate(`/article/${data.payload.slug}`);
        })
        .catch((error) => {
          console.log(error);
          alert("Try again!");
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

  const touched = formik.touched;
  const errors = formik.errors;

  useEffect(() => {
    if (slug && currentArticle.slug === slug) {
      formik.setValues({
        title: currentArticle.title,
        description: currentArticle.description,
        body: currentArticle.body,
        tagList: currentArticle.tagList,
      });
      setListTags(currentArticle.tagList);
    }
    if (!currentArticle.slug || currentArticle.slug !== slug) {
      slug && dispatch(getCurrentArticle(slug));
    }
    // Neu khong co current article slug hoac current article slug khac slug thi getCurrentArticle(slug)
    // Sau do neu get thanh cong thi set values cho formik, list tags
    // Neu khong thanh cong thi navigate ve editor <khong slug>
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  // Events
  const uppercaseFirstChar = (string: string) => {
    return string[0].toUpperCase() + string.slice(1, string.length);
  };

  const handleTagChange = (value: string[]) => {
    setListTags(value);
    formik.setFieldValue("tagList", value);
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
          <Form.Control
            as="textarea"
            rows={8}
            placeholder="Write your article (in markdown)"
            {...formik.getFieldProps("body")}
            isInvalid={touched.body && !!errors.body}
            disabled={disabled}
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
                value={listTags}
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
          disabled={disabled}
        >
          Publish Article
        </Button>
      </Form>
    </ContentWrapper>
  );
};
