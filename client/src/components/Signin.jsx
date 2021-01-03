import React, { useState } from "react";
import Form from "./forms/Form";
import MainContainer from "./forms/MainContainer";
import Input from "./forms/Input";
import { useForm } from "react-hook-form";
import { Redirect, Link } from "react-router-dom";
import PrimaryButton from "./forms/PrimaryButton";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { login, getCurrentUser } from "../services/userService";
import PageHeader from "./utils/PageHeader";
import { useToasts } from "react-toast-notifications";
import "../App.css";

// Signin values requirements
const schema = yup.object().shape({
  email: yup
    .string()
    .email("Email should have correct format")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Passwrod should be a minimum of 6 charcters long")
    .required("Password is required"),
});

/**
 * Component - Signin form
 * @component
 */
function Signin() {
  const { addToast } = useToasts();
  const [error, setError] = useState("");
  const { register, handleSubmit, errors } = useForm({
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  /**
   * Send request to server to login a user
   * @param {object} data - Values gathered by usForm hook from the inputs
   */
  async function onSubmit(data) {
    try {
      const { email, password } = data;
      await login(email, password);
      // Move to Home page
      window.location = "/";
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError(error.response.data);
      }
      if (error.response && error.response.status === 401) {
        addToast(error.response.data, {
          appearance: "warning",
          autoDismissTimeOut: 10000,
        });
      }
    }
  }

  //If user logged in move to Home page
  if (getCurrentUser()) return <Redirect to="/" />;
  return (
    <React.Fragment>
      <PageHeader>
        <div className="text-center">Signin</div>
      </PageHeader>

      <MainContainer>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Input
            ref={register}
            type="email"
            label="Email"
            name="email"
            required
            error={!!errors.email}
            helperText={errors?.email?.message}
          />
          <Input
            ref={register}
            type="password"
            label="Password"
            name="password"
            required
            error={!!errors.password || !!error}
            helperText={errors?.password?.message || error}
          />
          <Link to="/step1">Don't have account?</Link>
          <PrimaryButton type="submit">Submit</PrimaryButton>
        </Form>
      </MainContainer>
    </React.Fragment>
  );
}

export default Signin;
