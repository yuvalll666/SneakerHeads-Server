import Typography from "@material-ui/core/Typography";
import React, { useState } from "react";
import MainContainer from "./forms/MainContainer";
import { Link } from "react-router-dom";
import { useData } from "../DataContext";
import PrimaryButton from "./forms/PrimaryButton";
import { Redirect, useHistory } from "react-router-dom";
import http from "../services/httpService";
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@material-ui/core";
import { getCurrentUser } from "../services/userService";
import PageHeader from "./utils/PageHeader";
import swal from "sweetalert2";
import { apiUrl } from "../config.json";

/**
 * Component - Final step of signup wizard
 * @component
 */
function Result() {
  const { data } = useData();
  let entries = Object.entries(data);
  entries.pop();
  const [error, setError] = useState("");
  const history = useHistory();

  /**
   * <pre>
   * const {data} - Object containes user information
   * Send request to server to signup a user
   * </pre>
   */
  async function onSubmit() {
    try {
      await http.post(`${apiUrl}/users/signup`, data);
      // Fire success popup
      swal
        .fire(
          "Signup Successfull!",
          "Confirmation email have been sent to your email inbox.",
          "success"
        )
        .then((data) => {
          if (data && data.isConfirmed) {
            // Move to sign in page
            history.push("/signin");
          }
        });
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError(error.response.data.error);
      } else if (error.response && error.response.status === 409) {
        setError(error.response.data.error);
      }
    }
  }
  // If user logged in Move to Home page
  if (getCurrentUser()) return <Redirect to="/" />;
  return (
    <React.Fragment>
      <PageHeader>
        <div className="text-center">Result</div>
      </PageHeader>

      <MainContainer>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Field</TableCell>
                <TableCell>Value</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {entries.map((entry) => (
                <TableRow key={entry[0]}>
                  <TableCell>{entry[0]}</TableCell>
                  <TableCell>{entry[1]}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <PrimaryButton onClick={onSubmit}>Submit</PrimaryButton>
        {error && (
          <Typography component="div" variant="subtitle1" color="secondary">
            {error}
          </Typography>
        )}
        <Link to="/step1">Start Over</Link>
      </MainContainer>
    </React.Fragment>
  );
}

export default Result;
