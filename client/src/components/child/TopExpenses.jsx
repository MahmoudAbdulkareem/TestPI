import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const TopExpenses = () => {
  const [topExpenses, setTopExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetching top expenses from the API
    const fetchTopExpenses = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Not authenticated. Please log in.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          "http://localhost:5001/api/expenses/top-expenses",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.status === 200) {
          setTopExpenses(response.data.data);
        } else {
          setError("Failed to fetch top expenses.");
        }
      } catch (error) {
        console.error("Error fetching top expenses:", error);
        setError("An error occurred while fetching top expenses.");
      } finally {
        setLoading(false);
      }
    };

    fetchTopExpenses();
  }, []);

  return (
    <div className="col-xxl-4 col-md-6">
      <div className="card h-100">
        <div className="card-header">
          <div className="d-flex align-items-center flex-wrap gap-2 justify-content-between">
            <h6 className="mb-2 fw-bold text-lg mb-0">Top Expenses</h6>
            <Link
              to="/expenses" // assuming you have an 'expenses' page to show all expenses
              className="text-primary-600 hover-text-primary d-flex align-items-center gap-1"
            >
              View All
              <iconify-icon
                icon="solar:alt-arrow-right-linear"
                className="icon"
              />
            </Link>
          </div>
        </div>
        <div className="card-body p-24">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <div className="table-responsive scroll-sm">
              <table className="table bordered-table mb-0">
                <thead>
                  <tr>
                    <th scope="col">Category</th>
                    <th scope="col">Amount</th>
                    <th scope="col">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {topExpenses.length > 0 ? (
                    topExpenses.map((expense) => (
                      <tr key={expense._id}>
                        <td>
                          <span className="text-secondary-light">
                            {expense.category || "N/A"}
                          </span>
                        </td>
                        <td>
                          <span className="text-secondary-light">
                            {expense.amount?.toFixed(2) || "0.00"}
                          </span>
                        </td>                        
                        <td>
                          <span className="text-secondary-light">
                            {new Date(expense.date).toLocaleDateString()}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center">
                        No top expenses found.
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

export default TopExpenses;
