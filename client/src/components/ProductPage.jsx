import React, { useState, useEffect, useContext } from "react";
import http from "../services/httpService";
import ProductCarousel from "./productDetails/ProductCarousel";
import ProductInfo from "./productDetails/ProductInfo";
import { Typography } from "@material-ui/core";
import { useToasts } from "react-toast-notifications";
import { userRole } from "../config.json";
import swal from "sweetalert2";
import { UserContext } from "../App";
import { useHistory } from "react-router-dom";
import { localUrl, apiUrl } from "../config.json";
const { ADMIN, EDITOR, NORMAL } = userRole;

/**
 * Component - Product page, single product
 * @component
 */
const ProductPage = (props) => {
  const history = useHistory();
  const user = useContext(UserContext);
  const { addToast } = useToasts();
  const productId = props.match.params.productId;
  const [Product, setProduct] = useState([]);
  /**
   * On page load fetch single product data from DB using _id
   */
  useEffect(() => {
    http
      .get(`${apiUrl}/products/product_by_id?id=${productId}`)
      .then((response) => {
        setProduct(response.data[0]);
      });
  }, []);
  /**
   * Send request to server to add a product to the cart
   * @param {String} productId - product id number
   */
  const addToCartHandler = async (productId) => {
    if (!user) {
      return swal
        .fire({
          title: "Please Login To Add Products",
          icon: "info",
          showDenyButton: true,
          showCancelButton: true,
          confirmButtonText: `Register Here`,
          denyButtonText: `Sign In`,
        })
        .then((result) => {
          if (result.isConfirmed) {
            window.location = "/step1";
          } else if (result.isDenied) {
            window.location = "/signin";
          }
        });
    }
    await http
      .post(`${apiUrl}/users/addToCart`, { productId })
      .then((response) => {
        // Replace user's JWT token to new one in local storage
        localStorage.setItem("token", response.data.token);
        swal
          .fire({
            title: "Successfully Added To Your Cart",
            icon: "success",
            showDenyButton: true,
            showCloseButton: true,
            confirmButtonText: `Keep Shopping`,
            denyButtonText: `Go To Cart`,
          })
          .then((result) => {
            if (result.isConfirmed) {
              window.location = "/products";
            } else if (result.isDenied) {
              window.location = "/cart";
            }
          });
      })
      .catch((err) =>
        addToast(
          "Error: Unexpcted problem. Coludn't add this products to your cart",
          { appearance: "error" }
        )
      );
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        {Product.tags && (
          <div className="mt-4 col-10">{Product.tags.join(" / ")}</div>
        )}
        <div className="col-12 text-center">
          <Typography className="mt-4" component="h1" variant="h3">
            {Product.title}
          </Typography>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-lg-12">
          <ProductCarousel product={Product} />
        </div>
      </div>
      <div style={{ marginTop: "50px" }}>
        <ProductInfo addToCart={addToCartHandler} product={Product} />
      </div>
    </div>
  );
};

export default ProductPage;
