import React from "react";
import { Formik, ErrorMessage, Form, Field } from "formik";
import * as Yup from "yup";
import { useAuth } from "../auth_context";
import { useRouter } from "next/router";
import api from "../api";

const LoginForm = () => {
  const { login } = useAuth();
  const router = useRouter();
  return (
    <Formik
      initialValues={{ username: "", password: "" }}
      validationSchema={Yup.object({
        username: Yup.string().required("Required"),
        password: Yup.string().required("Required"),
      })}
      onSubmit={async ({ username, password }, { setSubmitting, setErrors }) => {
        try {
          await login(username, password)
          setSubmitting(false);
          router.push("/posts");
        } catch (error) {
          const formikErrors = { password: error.response.data.error };
          setErrors(formikErrors);
          setSubmitting(false);
        }
      }}
    >
        {({ isSubmitting }) => (
            <Form>
                <div>
                    <Field name="username" type="text"></Field>
                    <ErrorMessage name="username" component="p"></ErrorMessage>
                </div>
                <div>
                    <Field name="password" type="password"></Field>
                    <ErrorMessage name="password" component="p"></ErrorMessage>
                </div>
                <button type="submit" disabled={isSubmitting}>Login</button>
            </Form>
      
        )}
    </Formik>
  );
};

export default LoginForm;