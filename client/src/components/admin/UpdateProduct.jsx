import React, { useState, useContext, useEffect } from "react";
import MainContainer from "../forms/MainContainer";
import Form from "../forms/Form";
import Input from "../forms/Input";
import PrimaryButton from "../forms/PrimaryButton";
import { useForm } from "react-hook-form";
import FileUpload from "../utils/FileUpload";
import { makeStyles } from "@material-ui/core/styles";
import { UserContext } from "../../App";
import http from "../../services/httpService";
import { apiUrl, userRole } from "../../config.json";
import { useHistory } from "react-router-dom";
import ChipInput from "material-ui-chip-input";
import SystemUpdateAltIcon from "@material-ui/icons/SystemUpdateAlt";
import PageHeader from "../utils/PageHeader";
import { brands } from "../../datas";
import { useToasts } from "react-toast-notifications";

// Items CSS styles
const useStyles = makeStyles((them) => ({
  root: {
    marginTop: them.spacing(0),
  },
}));

/**
 * Component - UpdateProduct
 * @component
 * @param {Object} props - Containes product _id in params
 */
function UpdateProduct(props) {
  const productId = props.match.params.productId;
  const { addToast } = useToasts();
  const user = useContext(UserContext);
  const styles = useStyles();
  const history = useHistory();
  const [Chips, setChips] = useState([]);
  const [images, setImages] = useState([]);
  const [Product, setProduct] = useState({});

  /**
   * On page load send request to server to get single product by _id
   */
  useEffect(() => {
    http
      .get(`${apiUrl}/admin/update-product/product_by_id?id=${productId}`)
      .then((response) => {
        if (response && response.data) {
          // When server response set Product to the response data
          setProduct(response.data);
          // Set the images to product images
          setImages(response.data.images);
          // Set Chips to product tags
          setChips(response.data.tags);
        }
      })
      .catch((error) => {
        addToast("Error: Couldn't fetch product from the server", {
          appearance: "error",
        });
      });
  }, []);

  const { register, handleSubmit } = useForm({
    mode: "onBlur",
  });

  /**
   * Updates Array of images to new one
   * @param {Array.<String>} newImages - Array of images paths
   */
  const updateImages = (newImages) => {
    setImages(newImages);
  };

  /**
   * Send request to server to update existing product
   * @param {Object} data - Values gathered by usForm hook from the inputs
   */
  const onSubmit = async (data) => {
    const { title, description, price, brand } = data;
    // If either one not exists, bail
    if (!title || !description || !price || isNaN(brand) || !images) {
      return addToast("Please fill all of the fields first!", {
        appearance: "error",
      });
    }

    /**
     * ProductInfo object
     * @type {{
     * writer: String,
     * images: Array,
     * tags: Array,
     * title: String,
     * description: String,
     * price: Number,
     * brand: Number
     * }}
     */
    const productInfo = {
      writer: user._id,
      images: images,
      tags: Chips,
      ...data,
    };

    try {
      await http.put(
        `${apiUrl}/admin/update-product/product_by_id?id=${productId}`,
        productInfo
      );
      addToast("Product updated successfuly", {
        appearance: "success",
      });
      // Move to HandleProduct page
      history.push("/handle-products");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        addToast(error.response.data.error, {
          appearance: "success",
        });
      }
    }
  };

  /**
   * Set the state of Chips to a new one
   * @param {Array.<String>} chips - Array of strings (tags)
   */
  const handleChange = (chips) => {
    setChips(chips);
  };

  const renderBrands = () => {
    let array = brands.map((item) => {
      if (item._id === Product.brand) {
        return (
          <option selected="selected" key={item._id} value={item._id}>
            {item.name}
          </option>
        );
      } else {
        return (
          <option key={item._id} value={item._id}>
            {item.name}
          </option>
        );
      }
    });
    return array;
  };

  return (
    <div>
      <PageHeader>
        Update Product <SystemUpdateAltIcon fontSize="inherit" />
      </PageHeader>

      <Form onSubmit={handleSubmit(onSubmit)}>
        <FileUpload oldImages={images} refreshFunction={updateImages} />
        <MainContainer className={styles.root} maxWidth="sm">
          <input
            defaultValue={Product.title}
            placeholder="Title"
            name="title"
            label="Title"
            id="title"
            ref={register}
            className="form-control mb-3"
          />
          <textarea
            defaultValue={Product.description}
            className="form-control"
            name="description"
            id="description"
            placeholder="Prodcut Description"
            cols="50"
            rows="7"
            ref={register}
          />
          <select
            className="form-control mt-3"
            name="brand"
            id="brand"
            ref={register}
          >
            <option>Choose Brand...</option>

            {renderBrands()}
          </select>
          <input
            defaultValue={Product.price}
            className="form-control mt-3"
            name="price"
            label="Price"
            id="price"
            placeholder="Product Price ( $ )"
            type="number"
            ref={register}
          />
          <ChipInput
            defaultValue={Product.tags}
            fullWidth
            placeholder="+Add_Tag"
            onChange={(chips) => handleChange(chips)}
            className="mt-2"
            ref={register}
          />
          <PrimaryButton type="submit">Submit</PrimaryButton>
        </MainContainer>
      </Form>
    </div>
  );
}

export default UpdateProduct;
