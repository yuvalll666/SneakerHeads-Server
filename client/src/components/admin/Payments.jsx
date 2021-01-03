import React, { useState, useEffect, useContext } from "react";
import http from "../../services/httpService";
import { apiUrl, userRole } from "../../config.json";
import { UserContext } from "../../App";
import { Redirect } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import PageHeader from "../utils/PageHeader";
import {
  Table,
  TableContainer,
  TableHead,
  TableRow,
  withStyles,
  TableCell,
  TableBody,
  Paper,
} from "@material-ui/core";
import { getDate } from "../../datas";
const { ADMIN } = userRole;

// Table Cell CSS styles
const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: "#e0e0e0",
  },
}))(TableCell);

/**
 * Component - Payments page
 * @component
 */
function Payments() {
  const user = useContext(UserContext);
  const [Payments, setPayments] = useState([]);
  const { addToast } = useToasts();
  /**
   * On page load get all payments {Array.<Object>}
   */
  useEffect(() => {
    // Send request to server
    http
      .get(`${apiUrl}/admin/payments`)
      .then((response) => {
        setPayments(response.data);
      })
      .catch((error) => {
        addToast("Error: Couldn't get Payments from the server", {
          appearance: "error",
        });
      });
  }, []);

  /**
   * @returns - Table row with cells
   */
  const view = Payments.map((item, index) => {
    let user = item.user[0];
    let paymentData = item.paymentData[0];
    let products = item.product;
    // Make array of products prices
    let arr = products.map((item) => {
      return item.price;
    });
    // Get total sum of all products prices
    let reducedNum = arr.reduce((a, b) => a + b, 0);
    console.log(products[0]);

    return (
      <TableRow key={index} className={index % 2 ? "bg-light" : "bg-white"}>
        <TableCell>
          Name: {user.firstName + " " + user.lastName}
          <br />
          Email: {user.email}
          <br />
          ID: {user._id}
        </TableCell>
        <TableCell>
          Credit Name: {paymentData.address.recipient_name}
          <br />
          Country: {paymentData.address.country_code}
          <br />
          Postal code: {paymentData.address.postal_code}
          <br />
          {paymentData.paid && "PAID"}
          {paymentData.cancelled && "CANCELLED"}
        </TableCell>
        <TableCell>
          {products.map((item, index) => {
            return (
              <div key={index} className="card p-2 m-1 bg-info text-white">
                Name: {item.name}
                <br />
                Price: {item.price}
                <br />
                Quantity: {item.quantity}
                <br />
                ID: {item._id}
              </div>
            );
          })}
        </TableCell>
        <TableCell>
          Date of purchase:
          <br />
          {getDate(products[0].dateOfPurchase)}
          <br />
          Total pay: ${reducedNum}
        </TableCell>
      </TableRow>
    );
  });

  // If user in not ADMIN move to Home page
  setTimeout(() => {
    if (user && user.role !== ADMIN) {
      return <Redirect to="/" />;
    }
  }, 100);
  return (
    <div>
      <PageHeader>User's Payments</PageHeader>

      <div className="container">
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>User Information</StyledTableCell>
                <StyledTableCell>Payment Details</StyledTableCell>
                <StyledTableCell align="center">
                  Products Details
                </StyledTableCell>
                <StyledTableCell>Date And Total</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>{view}</TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}

export default Payments;
