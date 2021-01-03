import React from "react";
import { useForm } from "react-hook-form";
import { Redirect, useHistory } from "react-router-dom";
//Components
import Form from "./forms/Form";
import MainContainer from "./forms/MainContainer";
import Input from "./forms/Input";
import PrimaryButton from "./forms/PrimaryButton";
import { useData } from "../DataContext";
//Dependcies
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { getCurrentUser } from "../services/userService";
import PageHeader from "./utils/PageHeader";
import "../App.css";

const schema = yup.object().shape({
  firstName: yup
    .string()
    .matches(/^([^0-9]*)$/, "First name should not contain numbers")
    .required("First name is required")
    .min(2, "First name should be a minimum 2 charcters long")
    .max(30, "First name most be shorter then 30 charcters "),
  lastName: yup
    .string()
    .matches(/^([^0-9]*)$/, "Last name should not contain numbers")
    .required("Last name is required")
    .min(2, "Last name should be a minimum 2 charcters long")
    .max(30, "Last name most be shorter then 30 charcters"),
});
/**
 * Component - Step 1 of signup wizard
 * @component
 */
function Step1() {
  const { setValues, data } = useData();
  const { register, handleSubmit, errors } = useForm({
    defaultValues: { firstName: data.firstName, lastName: data.lastName },
    mode: "onBlur",
    resolver: yupResolver(schema),
  });
  const history = useHistory();

  /**
   * Adding global values of useData
   * @param {object} data - Values gathered by usForm hook from the inputs
   */
  const onSubmit = (data) => {
    // Move to Step2 page
    history.push("/step2");
    setValues(data);
  };

   //If user logged in move to Home page
  if (getCurrentUser()) return <Redirect to="/" />;
  return (
    <React.Fragment>
      <PageHeader>
        <div className="text-center">Step 1</div>
      </PageHeader>

      <MainContainer>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Input
            ref={register}
            name="firstName"
            type="text"
            label="First Name"
            required
            error={Boolean(errors.firstName)}
            helperText={errors?.firstName?.message}
          />

          <Input
            ref={register}
            name="lastName"
            type="text"
            label="Last Name"
            required
            error={Boolean(errors.lastName)}
            helperText={errors?.lastName?.message}
          />
          <PrimaryButton type="submit">Next</PrimaryButton>
        </Form>
      </MainContainer>
    </React.Fragment>
  );
}

export default Step1;
