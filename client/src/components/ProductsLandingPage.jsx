import React, { useState, useEffect } from "react";
import http from "../services/httpService";
import PrimaryButton from "./forms/PrimaryButton";
import ImageSlider from "../components/utils/ImageSlider";
import { Col, Row, Card } from "antd";
import Meta from "antd/lib/card/Meta";
import CheckBox from "./productDetails/CheckBox";
import RadioBox from "./productDetails/RadioBox";
import { brands, price } from "../datas";
import SearchFeature from "./productDetails/SearchFeature";
import "../css/ProductLandingPage.css";
import { CircularProgress, makeStyles } from "@material-ui/core";
import { useToasts } from "react-toast-notifications";
import PageHeader from "./utils/PageHeader";
import { localUrl, apiUrl } from "../config.json";

const useStyles = makeStyles((them) => ({
  topImage: {
    backgroundImage: `url("${localUrl}/images/pexels-ray-piedra-1503009.jpg");`,
  },
}));

/**
 * Component - ProductLandingPage, Browse Page
 * @component
 */
function ProductsLandingPage() {
  const styles = useStyles();
  const { addToast } = useToasts();
  const [SearchValue, setSearchValue] = useState("");
  const [Products, setProducts] = useState([]);
  const [Limit, setLimit] = useState(12);
  const [PostSize, setPostSize] = useState(0);
  const [Filters, setFilter] = useState({
    brand: [],
    price: [],
  });
  const [LastId, setLastId] = useState("");

  /**
   * On page load run getProducts with Limit {Number}
   * @see getProducts
   */
  useEffect(() => {
    const variables = {
      limit: Limit,
    };

    getProducts(variables);
  }, []);

  /**
   * <pre>
   * Render products from DB
   * const productsList {Array} - Array of product objects
   * const postSize {Number} - Amount of products returned
   * @param {Obejct} variables - Info passed to server
   * </pre>
   */
  const getProducts = (variables) => {
    // Send request to server
    http.post(`${apiUrl}/products/getProducts`, variables).then((response) => {
      if (response.data.success) {
        const { productsList, postSize } = response.data;
        // If there's no items in the array set PostSize to 0
        if (!productsList.length) {
          setPostSize(0);
        }
        // If loadMore exists add productsList items to the existing Products array
        // Else set Products array to productsList
        if (variables.loadMore) {
          setProducts([...Products, ...productsList]);
        } else {
          setProducts(productsList);
        }
        setPostSize(postSize);

        let lastIndex = productsList.length - 1;
        let lastProduct = productsList[lastIndex];
        // If there's a last item set LastId state to the id {string} of
        // the last object in the array
        if (lastProduct && lastProduct._id) {
          setLastId(lastProduct._id);
        }
      } else {
        addToast("Faild to fetch products data", {
          appearance: "error",
        });
      }
    });
  };

  /**
   * Call getProducts with new variables
   * @see getProducts
   */
  const onLoadMore = () => {
    const variables = {
      lastId: LastId,
      limit: Limit,
      loadMore: true,
    };

    getProducts(variables);
  };

  /**
   * Call getProducts with new variables
   * @see getProducts
   */
  const filteredResults = (filters) => {
    const variables = {
      limit: Limit,
      filters: filters,
    };
    getProducts(variables);
  };

  /**
   * const price {array} - Array of objects containes id and array
   * @param {Number} value - Int
   * @returns {Array.<String>} - Array of 2 strings
   */
  const handlePrice = (value) => {
    let array = [];

    for (let key in price) {
      //When id equals to value param set array to the object[array]
      if (price[key]._id === parseInt(value, 10)) {
        array = price[key].array;
      }
    }
    return array;
  };

  /**
   * Set the filters of http request to render specific products
   * @param {Array.<Number> | Number} filters - Array of numbers || Single number
   * @param {String} category - category name
   * @see filteredResults
   */
  const handleFilters = (filters, category) => {
    const newFilter = { ...Filters };
    // If the category is "price" set the newFilters.price handlePrice result
    // Else set any category to filters value
    if (category === "price") {
      let priceValue = handlePrice(filters);
      newFilter[category] = priceValue;
    } else {
      newFilter[category] = filters;
    }

    filteredResults(newFilter);
    setFilter(newFilter);
  };

  /**
   * Filter http request result by text
   * @param {String} newSearchTerm
   * @see getProducts
   */
  const updateSearchValues = (newSearchTerm) => {
    const variables = {
      limit: Limit,
      filters: Filters,
      searchTerm: newSearchTerm,
    };

    setSearchValue(newSearchTerm);
    getProducts(variables);
  };

  // Render products cards by mapping Products {Array}
  const renderCards = Products.map((prod, index) => {
    return (
      <Col lg={6} md={8} xs={12} key={index}>
        <Card
          style={{ backgroundColor: "#fafafa", overflow: "hidden" }}
          bordered={true}
          hoverable={true}
          cover={
            <a href={`/products/${prod._id}`}>
              <ImageSlider images={prod.images} />{" "}
            </a>
          }
        >
          <Meta title={prod.title} description={`$${prod.price}`} />
        </Card>
      </Col>
    );
  });

  return (
    <React.Fragment>
      <div className="d-sm-block d-md-none">
        <PageHeader>Browse</PageHeader>
      </div>
      <div className="container">
        <div className="d-none d-sm-none d-md-block">
          <div
            className={`col-12 d-flex flex-column align-items-end product-landingpage-header-container ${styles.topImage} `}
          >
            <div className="d-flex mt-2 flex-column text-box">
              <h1>Sneakers</h1>
              <p>
                Air Jordan, adidas, Nike, Yeezy and more! Buy all the latest
                sneakers & shoes right here on SneakerHeads.
              </p>
            </div>
          </div>
        </div>

        <div className="row mb-2 mt-4">
          <div className="col-lg-6 col-md-6">
            <CheckBox
              brands={brands}
              handleFilters={(filters) => handleFilters(filters, "brand")}
            />
          </div>
          <div className="col-lg-6 col-md-6">
            <RadioBox
              price={price}
              handleFilters={(filters) => handleFilters(filters, "price")}
            />
          </div>
          <div className="mt-lg-2 d-flex justify-content-end col-lg-4 col-md-12">
            <SearchFeature updateSearchValues={updateSearchValues} />
          </div>
        </div>
        {Products.length === 0 ? (
          <div className="row justify-content-center">
            <div
              style={{ height: "300px" }}
              className="d-flex justify-content-center align-items-center"
            >
              <CircularProgress />
            </div>
          </div>
        ) : (
          <div className="mt-2">
            <Row gutter={[30, 16]}>{renderCards}</Row>
          </div>
        )}

        {PostSize >= Limit && (
          <div className="row justify-content-center">
            <div>
              <PrimaryButton
                variant="outlined"
                onClick={onLoadMore}
                fullWidth={false}
              >
                Load More
              </PrimaryButton>
            </div>
          </div>
        )}
      </div>
    </React.Fragment>
  );
}

export default ProductsLandingPage;
