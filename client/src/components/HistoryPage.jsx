import React, { useEffect, useState } from "react";
import http from "../services/httpService";
import HistoryTable from "./utils/HistoryTable";
import PageHeader from "./utils/PageHeader";
import { useToasts } from "react-toast-notifications";
import { apiUrl } from "../config.json";

/**
 * Component - History page, purchases information
 * @component
 */
function HistoryPage() {
  const { addToast } = useToasts();
  const [History, setHistory] = useState([]);

  /**
   * On page load send request to server to get purchases history
   */
  useEffect(() => {
    http.get(`${apiUrl}/users/getHistory`).then((response) => {
      if (response.data.success) {
        setHistory(response.data.history);
      } else {
        addToast("Failed to get History", { appearance: "error" });
      }
    });
  }, []);

  return (
    <React.Fragment>
      <PageHeader>Purchase History</PageHeader>
      <div className="container-lg container-md">
        <HistoryTable history={History} />
      </div>
    </React.Fragment>
  );
}

export default HistoryPage;
