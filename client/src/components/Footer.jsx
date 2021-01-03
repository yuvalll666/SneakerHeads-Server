import React from "react";
import "../css/Footer.css";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <div className="footer-container">
      <div className="top-stripe-container col-12">
        <div className="container-fluid">
          <div className="row mt-4 d-flex justify-content-center">
            <div className="col-4 sections">
              <nav className="footer-navbar">
                <h5 className="section-headline">Collection</h5>
                <div>
                  <ul>
                    <li>
                      <Link className="links" to="/">
                        Home Page
                      </Link>
                    </li>
                    <li>
                      <Link className="links" to="/products">
                        Browse
                      </Link>
                    </li>
                    <li>
                      <Link className="links" to="/cart">
                        My Cart
                      </Link>
                    </li>
                    <li>
                      <Link className="links" to="/user-page">
                        Settings
                      </Link>
                    </li>
                    <li>
                      <Link className="links" to="">
                        {" "}
                      </Link>
                    </li>
                  </ul>
                </div>
              </nav>
            </div>

            <div className="col-4 sections">
              <nav className="footer-navbar">
                <h5 className="section-headline">Brands</h5>
                <div>
                  <ul>
                    <li>
                      <Link className="links" to="/">
                        Air Jordan
                      </Link>
                    </li>
                    <li>
                      <Link className="links" to="/products">
                        Nike
                      </Link>
                    </li>
                    <li>
                      <Link className="links" to="/cart">
                        Adidas
                      </Link>
                    </li>
                    <li>
                      <Link className="links" to="/user-page">
                        Yeezy
                      </Link>
                    </li>
                    <li>
                      <Link className="links" to="">
                        {" "}
                      </Link>
                    </li>
                  </ul>
                </div>
              </nav>
            </div>

            <div className="col-4 sections">
              <div>
                <h5 className="section-headline ">Contact Us</h5>
                <div className="contact-us">
                  <h5>You can get us here</h5>
                  <strong>Tel: 054-2142-796</strong>

                  <p><strong>Email:</strong> Yuval@gmail.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-white lower-stripe-container">
        <span>SneakerHeads &copy; {new Date().getFullYear()} </span>
      </div>
    </div>
  );
}

export default Footer;
