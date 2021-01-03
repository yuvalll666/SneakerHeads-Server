import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import DataProvider from "./DataContext";
import * as serviceWorker from "./serviceWorker";

//Dependencies
import "bootstrap/dist/css/bootstrap.css";
import "@fortawesome/fontawesome-free/css/all.css";
import "popper.js/dist/popper";
import "bootstrap/dist/js/bootstrap";
import { BrowserRouter } from "react-router-dom";
import "antd/dist/antd.css";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <DataProvider>
        <App />
      </DataProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

serviceWorker.unregister();
