import React, { useState, useContext } from "react";
import MainContainer from "./forms/MainContainer";
import Form from "./forms/Form";
import Input from "./forms/Input";
import PrimaryButton from "./forms/PrimaryButton";
import { useForm } from "react-hook-form";
import FileUpload from "./utils/FileUpload";
import { makeStyles } from "@material-ui/core/styles";
import { UserContext } from "../App";
import http from "../services/httpService";
import { useHistory } from "react-router-dom";
import ChipInput from "material-ui-chip-input";
import { CloudUploadOutlined } from "@material-ui/icons";
import PageHeader from "./utils/PageHeader";
import { brands } from "../datas";
import { useToasts } from "react-toast-notifications";
import { apiUrl } from "../config.json";

const useStyles = makeStyles((them) => ({
  root: {
    marginTop: them.spacing(0),
  },
}));

/**
 * Component - Upload product form page
 * @component
 */
function UploadProduct() {
  const { addToast } = useToasts();
  const user = useContext(UserContext);
  const styles = useStyles();
  const history = useHistory();
  const [Chips, setChips] = useState([]);
  const [Images, setImages] = useState([]);

  const { register, handleSubmit } = useForm({
    mode: "onBlur",
  });

  /**
   * Set the state of Images to a new one
   * @param {Array.<String>} newImages - Array of images sources
   */
  const updateImages = (newImages) => {
    setImages(newImages);
  };

  /**
   * Send request to server to create new product
   * @param {Object} data - Values gathered by usForm hook from the inputs
   */
  const onSubmit = async (data) => {
    const { title, description, price, brand } = data;
    if (!title || !description || !price || !brand || !Images) {
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
      images: Images,
      tags: Chips,
      ...data,
    };

    try {
      await http.post(`${apiUrl}/uploadProduct`, productInfo);
      addToast("Product uploaded successfuly", {
        appearance: "success",
      });
      // Move to Home page
      history.push("/");
      // window.location = "/upload-product";
    } catch (error) {
      if (error.response && error.response.status === 400) {
        addToast(error.response.data.error, {
          appearance: "error",
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

  return (
    <div>
      <PageHeader>
        Upload Product <CloudUploadOutlined fontSize="inherit" />
      </PageHeader>

      <Form onSubmit={handleSubmit(onSubmit)}>
        <FileUpload updateImages={updateImages} />
        <MainContainer className={styles.root} maxWidth="sm">
          <Input name="title" label="Title" id="title" ref={register} />
          <textarea
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

            {brands.map((item) => (
              <option key={item.key} value={item._id}>
                {item.name}
              </option>
            ))}
          </select>
          <Input
            name="price"
            label="Price"
            id="price"
            placeholder="Product Price ( $ )"
            type="number"
            ref={register}
          />
          <ChipInput
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

export default UploadProduct;
