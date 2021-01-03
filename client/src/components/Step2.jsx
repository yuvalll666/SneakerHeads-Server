import React, { useState } from "react";
import Form from "../components/forms/Form";
import MainContainer from "../components/forms/MainContainer";
import Typography from "@material-ui/core/Typography";
import Input from "../components/forms/Input";
import { useForm } from "react-hook-form";
import { Redirect, useHistory } from "react-router-dom";
import { useData } from "../DataContext";
import {} from "../DataContext";
import PrimaryButton from "./forms/PrimaryButton";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { getCurrentUser } from "../services/userService";
import PageHeader from "./utils/PageHeader";

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Email should have correct format")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Passwrod should be a minimum of 6 charcters long")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .min(6, "Passwrod should be a minimum of 6 charcters long")
    .required("Password is required"),
});
/**
 * Component - Step 2 of signup wizard
 * @component
 */
function Step2() {
  const [error, setError] = useState({});
  const { data, setValues } = useData();
  const history = useHistory();
  const { register, handleSubmit, errors } = useForm({
    defaultValues: {
      email: data.email,
      password: data.password,
    },
    mode: "onBlur",
    resolver: yupResolver(schema),
  });
  /**
   * Adding global values of useData
   * @param {object} data - Values gathered by usForm hook from the inputs
   */
  const onSubmit = (data) => {
    const { password, confirmPassword } = data;
    // If passwords are diffrent from each other send error
    if (password !== confirmPassword) {
      setError({ confirmPassword: "Passwords most be the same" });
    } else {
      delete data.confirmPassword;
      //Move to Result page
      history.push("/result");
      setValues(data);
    }
  };

  // If user is logged in move to Home page
  if (getCurrentUser()) return <Redirect to="/" />;
  return (
    <React.Fragment>
      <PageHeader>
        <div className="text-center">Step 2</div>
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
            error={!!errors.password}
            helperText={errors?.password?.message}
          />
          <Input
            ref={register}
            type="password"
            label="Confirm Password"
            name="confirmPassword"
            required
            error={!!errors.confirmPassword || !!error.confirmPassword}
            helperText={
              errors?.confirmPassword?.message || error?.confirmPassword
            }
          />
          <PrimaryButton type="submit">Next</PrimaryButton>
        </Form>
      </MainContainer>
    </React.Fragment>
  );
}

export default Step2;
