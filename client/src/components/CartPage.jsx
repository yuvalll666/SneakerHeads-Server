import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../App";
import http from "../services/httpService";
import {
  Typography,
  makeStyles,
  CardContent,
  Card,
  CardActions,
  Button,
} from "@material-ui/core";
import { Empty } from "antd";
import CartTable from "./cartDetail/CartTable";
import Paypal from "./utils/Paypal";
import { Link, Redirect, useHistory } from "react-router-dom";
import PageHeader from "./utils/PageHeader";
import { useToasts } from "react-toast-notifications";
import { getCurrentUser } from "../services/userService";
import swal from "sweetalert2";
import Confetii from "react-confetti";
import { apiUrl } from "../config.json";

// Items CSS styles
const useStyles = makeStyles((them) => ({
  card: {
    alignSelf: "start",
    marginTop: them.spacing(2),
    background: "linear-gradient(#e5e5e5, #f5f5f5, #f5f5f5, #f5f5f5)",
  },
  link: {
    fontSize: "3em",
  },
}));

/**
 * Component - Cart page
 * @component
 */
function CartPage() {
  const history = useHistory();
  const { addToast } = useToasts();
  const styles = useStyles();
  const user = useContext(UserContext);
  const { cart } = user;
  const [ProductsInfo, setProductsInfo] = useState([]);
  const [TotalPrice, setTotalPrice] = useState(0);
  const [Quantity, setQuantity] = useState(0);
  const [Success, setSuccess] = useState(false);

  /**
   * const {user} - logged user
   * cont {cart} - user's cart details
   * On page load send request to server to get user's cart details
   */
  useEffect(() => {
    let cartItemsIds = [];

    if (user && cart) {
      // If there's items in cart push the items ids {Sting} to cartItemsIds
      if (cart && cart.length > 0) {
        cart.forEach((item) => {
          cartItemsIds.push(item._id);
        });
        http
          .get(
            `${apiUrl}/products/products_by_id?id=${cartItemsIds}&type=array`
          )
          .then((response) => {
            // Create Array of items quntity numbers
            let arr = cart.map((item) => {
              return item.quantity;
            });
            // Calculate the sum of the cart items quantity
            let reducedNum = arr.reduce((a, b) => a + b, 0);
            setQuantity(reducedNum);

            cart.forEach((cartItem) => {
              response.data.forEach((product, index) => {
                // If products ids from server and cart equal
                // Set quantity of server response product to cart item quantity
                if (cartItem._id === product._id) {
                  response.data[index].quantity = cartItem.quantity;
                }
              });
            });
            setProductsInfo(response.data);
          });
      }
    }
  }, [cart]);

  /**
   * Run totalSum if productInfo changes
   * @see totalSum
   */
  useEffect(() => {
    if (ProductsInfo.length > 0) {
      totalSum(ProductsInfo);
    }
  }, [ProductsInfo]);

  /**
   * Set the total sum of cart items price to TotalPrice state
   * @param {Array.<Object>} productsInfo
   */
  const totalSum = (productsInfo) => {
    let total = 0;
    productsInfo.map((item) => {
      total += parseInt(item.price, 10) * item.quantity;
    });

    setTotalPrice(total);
  };

  /**
   * <pre>
   * const {cart} - user's cart details Object
   * const {products} - cart products details Object
   * Send request to server to remove item from the cart
   * @param {String} productId
   * </pre>
   */
  const removeFromCart = (productId) => {
    http
      .get(`${apiUrl}/users/removeFromCart?_id=${productId}`)
      .then((response) => {
        const { cart, products } = response.data;
        cart.forEach((cartItem) => {
          products.forEach((prod, i) => {
            // If ids of cartItem and product equal
            // Set product quantity to cartItem quantity
            if (cartItem._id === prod._id) {
              products[i].quantity = cartItem.quantity;
            }
          });
        });
        setProductsInfo(products);

        // Get the index of the prodcut to remove
        let indexId = ProductsInfo.map((item) => {
          return item._id;
        }).indexOf(productId);
        // Remove wanted product from the products array
        ProductsInfo.splice(indexId, 1);
        // If no products in cart refresh Cart page
        if (ProductsInfo.length === 0) {
          window.location = "/cart";
        }
        // Replace user's JWT token to updated token
        localStorage.setItem("token", response.data.token);
      })
      .catch((err) => console.log("err : ", err));
  };

  /**
   * <pre>
   * Send request to server to update user purchases history
   * and payment information
   * @param {Object} data - payment information gatherd from paypal component
   * </pre>
   */
  const transactionSuccess = (data) => {
    const variables = {
      cartDetail: ProductsInfo,
      paymentData: data,
    };

    http.post(`${apiUrl}/users/successBuy`, variables).then((response) => {
      if (response.data.success) {
        // Replace user's JWT token to updated token
        localStorage.setItem("token", response.data.token);
        // Fire success popup
        setSuccess(true);
        swal
          .fire(
            "Transaction Successfull!",
            "Your item will be sent as soon as possible",
            "success"
          )
          .then((data) => {
            if (data && data.isConfirmed) {
              // Move to Home page
              window.location = "/";
            }
          });
      } else {
        addToast("Failed to purchase item/s", { appearance: "error" });
      }
    });
  };
  if (Success) {
    return <Confetii />;
  }

  /**
   * Pop an error
   */
  const transactionError = () => {
    addToast("Error: Paypal server problem", { appearance: "error" });
  };

  /**
   * Pop an error
   */
  const transactionCanceled = () => {
    addToast("Transaction canceled", { appearance: "error" });
  };

  // If user not logged in move to Home page
  if (!getCurrentUser()) return <Redirect to="/" />;
  return (
    <React.Fragment>
      <PageHeader>Shopping Cart</PageHeader>
      <div className="container-lg container-md">
        <div className="row">
          <div className="col-12">
            <CartTable
              ProductsInfo={ProductsInfo}
              removeFromCart={removeFromCart}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            {TotalPrice > 0 ? (
              <Card style={{ display: "inline-block" }} className={styles.card}>
                <CardContent>
                  <Typography
                    className="d-flex justify-content-between"
                    variant="body1"
                    component="p"
                  >
                    <span>
                      Subtotal (
                      {Quantity > 1 ? (
                        <span>{Quantity} items</span>
                      ) : (
                        <span>{Quantity} item</span>
                      )}
                      )
                    </span>{" "}
                    <span>US ${TotalPrice}</span>
                  </Typography>
                  <Typography
                    className="d-flex justify-content-between"
                    variant="body1"
                    component="p"
                  >
                    Shipping <span>Free</span>
                  </Typography>
                  <hr />
                  <div className="d-flex justify-content-between">
                    <Typography variant="h5" component="h2">
                      Order total
                    </Typography>
                    <Typography variant="h6" component="h2">
                      US ${TotalPrice}
                    </Typography>
                  </div>
                </CardContent>
                <CardActions>
                  <Paypal
                    totalPrice={TotalPrice}
                    onSuccess={transactionSuccess}
                    transactionError={transactionError}
                    transactionCanceled={transactionCanceled}
                  />
                </CardActions>
              </Card>
            ) : (
              <React.Fragment>
                <Empty className="mt-4" description="No Items In Cart"></Empty>
                <div className="row justify-content-center">
                  <div className="mt-4 justify-content-center col-6">
                    <Link to="/products">
                      <Button
                        fullWidth
                        size="large"
                        color="primary"
                        variant="outlined"
                      >
                        {" "}
                        Shop Now{" "}
                      </Button>
                    </Link>
                  </div>
                </div>
              </React.Fragment>
            )}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default CartPage;
