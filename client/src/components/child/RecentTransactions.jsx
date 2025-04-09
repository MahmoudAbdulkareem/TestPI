import React, { useEffect, useState } from "react";
import axios from "axios";

const RecentTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5001/api/transactions/viewTransaction");
      if (response.status === 200) {
        setTransactions(response.data);
      }
    } catch (error) {
      setError("Error fetching transactions.");
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerSMS = async (transactionId) => {
    try {
      const response = await axios.post("http://localhost:5001/api/transactions/trigger-sms", {
        transactionId,
      });

      alert("🚀 SMS notification sent successfully!");
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;

      if (errorMessage.includes("Transaction does not meet the SMS criteria")) {
        alert("⚠️ SMS not sent: Transaction amount is below the required criteria.");
      } else if (errorMessage.includes("Invalid 'To' Phone Number")) {
        alert("❌ SMS failed: Invalid phone number format. Please check the user's phone number.");
      } else {
        alert("❌ Failed to send SMS: " + errorMessage);
      }

      console.error("Error triggering SMS:", errorMessage);
    }
  };

  const downloadReport = async (type) => {
    try {
      const url = `http://localhost:5001/api/export/generate-${type}`;
      const response = await axios.post(
        url,
        { transactions },
        { responseType: "blob" }
      );

      const blob = new Blob([response.data], {
        type:
          type === "pdf"
            ? "application/pdf"
            : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `recent_transactions.${type === 'excel' ? 'xlsx' : 'pdf'}`;
      link.click();

      alert(`✅ ${type.toUpperCase()} file downloaded successfully.`);
    } catch (error) {
      alert("❌ Failed to download " + type.toUpperCase() + ": " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="container-fluid px-4 mt-5">
      <div className="card w-100 mt-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h6 className="fw-bold text-lg mb-0">Recent Transactions</h6>
          <div>
            <button
              className="btn btn-outline-success me-2"
              onClick={() => downloadReport("excel")}
            >
              Export Excel
            </button>
            <button
              className="btn btn-outline-danger"
              onClick={() => downloadReport("pdf")}
            >
              Export PDF
            </button>
          </div>
        </div>
        <div className="card-body p-3">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-danger">{error}</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead className="table-light">
                  <tr>
                    <th>Date</th>
                    <th>Category</th>
                    <th>Amount (TND)</th>
                    <th>Bank Account</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.length > 0 ? (
                    transactions.map((transaction, index) => (
                      <tr key={index}>
                        <td>{new Date(transaction.date).toLocaleDateString()}</td>
                        <td>{transaction.type}</td>
                        <td>{transaction.amount || "N/A"}</td>
                        <td>{transaction.compteBancaire || "N/A"}</td>
                        <td>
                          <button
                            className="btn btn-outline-warning"
                            onClick={() => handleTriggerSMS(transaction._id)}
                          >
                            Trigger SMS
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center">
                        No transactions found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentTransactions;
