import React from "react";
import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useToasts } from "react-toast-notifications";



// Items CSS styles
const useStyles = makeStyles((them) => ({
  root: {
    fontSize: "1.7em",
    fontWeight: 600,
    letterSpacing: 1.3,
  },
}));

/**
 * Component - ProductInfo
 * @component
 * @param {Object} props - Containes product and addToCart function
 */
function ProductInfo(props) {
  const { addToast } = useToasts();
  const { product, addToCart } = props;

  const styles = useStyles();

  

  return (
    <div className="row mt-4">
      <div className="col-12 d-lg-flex justify-content-between">
        <div className="col-lg-7">
          <div>
            <span className={styles.root}>DESCRIPTION:</span>
            <p style={{ letterSpacing: 1.2, fontSize: "1.2em" }}>
              {product.description}{" "}
            </p>
          </div>
        </div>
        <div className="col-lg-4 d-flex flex-column">
          <span className={styles.root}>PRICE: ${product.price}</span>

          <div className="d-flex flex-column">
            <Button
              onClick={() => addToCart(product._id)}
              variant="contained"
              color="default"
            >
              <i className="fas fa-plus mr-2"></i> Add to cart
            </Button>
            <Button
              onClick={() => addToCart(product._id)}
              className="mt-2"
              variant="contained"
              color="primary"
            >
              Buy now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductInfo;
