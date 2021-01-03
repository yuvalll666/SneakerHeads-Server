import React, { useState, useEffect, useContext } from "react";
import http from "../../services/httpService";
import { apiUrl, userRole } from "../../config.json";
import { UserContext } from "../../App";
import { Redirect, Link, useHistory } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import PageHeader from "../utils/PageHeader";
import { brands } from "../../datas";
import {
  Table,
  TableContainer,
  TableHead,
  TableRow,
  withStyles,
  TableCell,
  TableBody,
  Paper,
  makeStyles,
  Button,
} from "@material-ui/core";
import { localUrl } from "../../config.json";
const { NORMAL } = userRole;

// Table Cell CSS styles
const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: "#e0e0e0",
  },
}))(TableCell);

// Items CSS styles
const useStyles = makeStyles((theme) => ({
  productImage: {
    width: "100px",
  },
  numbers: {
    fontSize: "1.1em",
    fontWeight: 600,
  },
}));

/**
 * Component - HandleProductsPage
 * @component
 */
function HandleProductsPage() {
  const history = useHistory();
  const styles = useStyles();
  const user = useContext(UserContext);
  const [Products, setProducts] = useState([]);
  const [DeletedProduct, setDeletedProduct] = useState({});
  const { addToast } = useToasts();

  /**
   * On page load get all products {Array.<Object>}
   */
  useEffect(() => {
    // Send request to server
    http
      .get(`${apiUrl}/admin/handle-products/getAllProducts`)
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        addToast("Error: Couldn't fetch products from the server", {
          appearance: "error",
        });
      });
  }, []);
  useEffect(() => {}, [Products]);

  /**
   * Get first Image of the Array
   * @param {Array.<String>} images - Array of image paths
   * @returns - Image path
   */
  const renderProductImage = (images) => {
    // If 1 or more items get in
    if (images.length > 0) {
      let image = images[0];
      return `${localUrl}/${image}`;
    }
  };

  /**
   * @returns - Table row with cells
   */
  const view = Products.map((prod, index) => {
    return (
      <TableRow key={index}>
        <TableCell>
          <img
            src={renderProductImage(prod.images)}
            alt="productImage"
            className={styles.productImage}
          />
        </TableCell>
        <TableCell>{prod._id}</TableCell>
        <TableCell>{prod.title}</TableCell>
        <TableCell>{prod.tags}</TableCell>
        <TableCell>
          <Button
            onClick={() => handleUpdate(prod._id)}
            className="mr-2"
            color="primary"
            variant="contained"
          >
            update
          </Button>
          <Button
            onClick={() => handleDelete(prod._id)}
            color="secondary"
            variant="contained"
          >
            delete
          </Button>
        </TableCell>
      </TableRow>
    );
  });

  /**
   * Move to UpdateProduct page with product _id
   * @param {String} productId - Product _id
   */
  const handleUpdate = (productId) => {
    return history.push(`/update-product/${productId}`);
  };

  /**
   * Delete specific product by _id
   * @param {Strinf} productId - Product _id
   */
  const handleDelete = (productId) => {
    // Alert ask message
    const confirm = window.confirm("Would you like to delete this product?");
    // If "OK" pressed get in
    if (confirm) {
      // Send request to server
      http
        .delete(`${apiUrl}/admin/handle-products/deleteProduct?id=${productId}`)
        .then((response) => {
          // Find the index of this product
          let indexId = Products.map((item) => {
            return item._id;
          }).indexOf(productId);
          // Remove product from the array
          Products.splice(indexId, 1);
          // Save deleted product information Object
          setDeletedProduct(response.data);
          addToast("Product deleted successfully", { appearance: "success" });
        })
        .catch((error) => {
          addToast("Error: Couldn't delete product", { appearance: "error" });
        });
    }
  };
  /**
   * Restore last deleted product
   * @param {Object} DeletedProduct - Last deleted product information
   */
  const undoDelete = (DeletedProduct) => {
    // Send request to server
    http
      .post(`${apiUrl}/admin/handle-products/undoDelete`, DeletedProduct)
      .then((response) => {
        let product = response.data;
        addToast("Product restored successfully", {
          appearance: "success",
        });
        setDeletedProduct(false);
        // Add restored product to Products array
        setProducts([...Products, product]);
        // Move to HandleProducts page
        window.location = "/handle-products";
      })
      .catch((error) => {
        addToast("Error: Could't restore Product", { appearance: "error" });
      });
  };

  /**
   * Filter results by brand
   * @param {Number | String} brandId - Brand _id number , "all" string
   */
  const handleBrandFilter = (brandId) => {
    //Send request to server
    http
      .get(`${apiUrl}/admin/handle-products/getAllProducts?filter=${brandId}`)
      .then((response) => {
        // Set Products to new Array.<Object>
        setProducts(response.data);
      })
      .catch((error) => {
        addToast("Error: Coludn't get products", { appearance: "error" });
      });
  };

  /**
   * @returns - Buttons with styles
   */
  const buttons = brands.map((brand) => {
    return (
      <Button
        onClick={() => handleBrandFilter(brand._id)}
        color="default"
        variant="contained"
      >
        {brand.name}
      </Button>
    );
  });

  // If Noraml user move to Home page
  if (user && user.role === NORMAL) {
    return <Redirect to="/" />;
  }
  return (
    <div>
      <PageHeader>Handle Products</PageHeader>

      <div className="container-fluid">
        <div className="d-flex flex-md-row flex-lg-row flex-xl-row flex-column justify-content-between mb-4">
          <Button
            onClick={() => handleBrandFilter("all")}
            color="default"
            variant="contained"
          >
            all brands
          </Button>

          {buttons}
        </div>
        {DeletedProduct && DeletedProduct._id && (
          <Link to="#" onClick={() => undoDelete(DeletedProduct)}>
            <i className="fas fa-exclamation-circle"></i>Undo Delete
          </Link>
        )}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>Products Image</StyledTableCell>
                <StyledTableCell>ID</StyledTableCell>
                <StyledTableCell>Title</StyledTableCell>
                <StyledTableCell>Tags</StyledTableCell>

                <StyledTableCell>Handle Product</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>{view}</TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}

export default HandleProductsPage;
