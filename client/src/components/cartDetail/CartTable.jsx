import React, { useContext } from "react";
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  makeStyles,
  withStyles,
  Button,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { localUrl } from "../../config.json";
import { useHistory, Link } from "react-router-dom";

// Table cell CSS styles
const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: "#3f51b5",
    color: theme.palette.common.white,
    fontSize: "1.1em",
    fontWeight: 500,
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
 * <pre>
 * Component - CartTable
 * @component
 * @param {Object} props - containes ProductsInfo {Object} and
 * removeFromCart {Function}
 * </pre>
 */
function CartTable({ ProductsInfo, removeFromCart }) {
  const styles = useStyles();
  const history = useHistory();

  /**
   * Return an image path
   * @param {Array.<String>} images - Array of image paths
   * @returns {String} - First image path of the array
   */
  const renderCartImage = (images) => {
    if (images.length > 0) {
      let image = images[0];
      return `${localUrl}/${image}`;
    }
  };

  const toProductPage = (productId) => {
    return history.push(`/products/${productId}`);
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <StyledTableCell align="left">Product Image</StyledTableCell>
            <StyledTableCell align="center">Quantity</StyledTableCell>
            <StyledTableCell align="right">Price</StyledTableCell>
            <StyledTableCell align="right">Remove From Cart</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {ProductsInfo.map((prod, index) => (
            <TableRow key={index}>
              <TableCell align="left">
                <Link to="#">
                  <img
                    onClick={() => toProductPage(prod._id)}
                    src={renderCartImage(prod.images)}
                    alt="productImage"
                    className={styles.productImage}
                  />
                </Link>
              </TableCell>
              <TableCell className={styles.numbers} align="center">
                {prod.quantity}
              </TableCell>
              <TableCell className={styles.numbers} align="right">
                ${prod.price}
              </TableCell>
              <TableCell align="right">
                <Button
                  onClick={() => removeFromCart(prod._id)}
                  variant="outlined"
                  color="secondary"
                  startIcon={<DeleteIcon />}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default CartTable;
