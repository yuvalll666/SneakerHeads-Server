//Components
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import About from "./components/About";
import Step1 from "./components/Step1";
import Step2 from "./components/Step2";
import Result from "./components/Result";
import Signin from "./components/Signin";
import Logout from "./components/Logout";
import Footer from "./components/Footer";
import UserPage from "./components/UserPage";
import ProductPage from "./components/ProductPage";
import UploadProduct from "./components/UploadProduct";
import ProductsLandingPage from "./components/ProductsLandingPage";
import Cart from "./components/CartPage";
import HistoryPage from "./components/HistoryPage";
import SingleUser from "./components/admin/SingleUser";
import DeletedUserProvider from "./DeletedUserContext";
import HandleProductsPage from "./components/admin/HandleProductsPage";
import UpdateProduct from "./components/admin/UpdateProduct";
import Payments from "./components/admin/Payments";
//Else
import { ToastProvider } from "react-toast-notifications";
import Jordan from "./components/brands/Jordan";
import Nike from "./components/brands/Nike";
import Yeezy from "./components/brands/Yeezy";
import Adidas from "./components/brands/Adidas";
import Confirmation from "./components/Confirmation";
import AllUsers from "./components/admin/AllUsers";
import React, { useState, useEffect, createContext } from "react";
import { Switch, Route, useParams } from "react-router-dom";
import { getCurrentUser } from "./services/userService";
import "./App.css";
import { userRole } from "./config.json";
const { ADMIN } = userRole;

// Create new context for user
export const UserContext = createContext(null);

function App() {
  const [user, SetUser] = useState({});

  /**
   * On page load get logged in user information {Object}
   */
  useEffect(() => {
    const user = getCurrentUser();
    SetUser(user);
  }, []);

  return (
    <React.Fragment>
      <ToastProvider
        autoDismiss
        autoDismissTimeout={6000}
        placement="top-center"
      >
        <header>
          <Navbar user={user} />
        </header>

        <main className="flex-fill">
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/about" component={About} />
            <Route path="/step1" component={Step1} />
            <Route path="/step2" component={Step2} />
            <Route path="/result" component={Result} />
            <Route path="/Signin" component={Signin} />
            <Route path="/logout" component={Logout} />
            <Route path="/products" exact component={ProductsLandingPage} />
            <Route path="/history" exact component={HistoryPage} />
            <Route path="/brands/jordan" component={Jordan} />
            <Route path="/brands/nike" component={Nike} />
            <Route path="/brands/yeezy" component={Yeezy} />
            <Route path="/brands/adidas" component={Adidas} />
            <Route path="/confirmation" component={Confirmation} />
            <DeletedUserProvider>
              <UserContext.Provider value={user}>
                <Route path="/products/:productId" component={ProductPage} />
                <Route path="/admin/payments" exact component={Payments} />
                <Route
                  path="/update-product/:productId"
                  exact
                  component={UpdateProduct}
                />
                <Route path="/admin/all-users" exact component={AllUsers} />
                <Route path="/admin/all-users/:userId" component={SingleUser} />
                <Route path="/handle-products" component={HandleProductsPage} />
                <Route path="/cart" component={Cart} />
                <Route path="/user-page" component={UserPage} />
                <Route path="/upload-product" component={UploadProduct} />
              </UserContext.Provider>
            </DeletedUserProvider>
          </Switch>
        </main>
        {window.location.pathname !== "/cpanel" && (
          <footer>
            <Footer></Footer>
          </footer>
        )}
      </ToastProvider>
    </React.Fragment>
  );
}

export default App;
