import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import axios from "axios";

const IncomeVsExpense = () => {
  const [timeframe, setTimeframe] = useState("Monthly");
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

  const data = {
    Monthly: { income: 2580.52, expense: 1247.19, incomeChange: 5, expenseChange: 3 },
    Weekly: { income: 645.13, expense: 311.79, incomeChange: 2, expenseChange: 1 },
    Today: { income: 92.16, expense: 45.38, incomeChange: 1, expenseChange: 0.5 },
  };

  const { income, expense, incomeChange, expenseChange } = data[timeframe];

  const incomeExpenseSeries = [
    {
      name: "Income",
      data: [income],
    },
    {
      name: "Expense",
      data: [expense],
    },
    ...topExpenses.map((expense) => ({
      name: expense.category || "Other",
      data: [expense.amount || 0],
    })),
  ];

  const incomeExpenseOptions = {
    chart: {
      type: "area",
      toolbar: {
        show: false,
      },
    },
    xaxis: {
      categories: [timeframe],
    },
    yaxis: {
      labels: {
        formatter: (value) =>
          new Intl.NumberFormat("en-TN", { style: "currency", currency: "TND" }).format(value),
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
    },
    plotOptions: {
      area: {
        lineColor: '#2D3A3F', // Adding color to the line
        fillOpacity: 0.3, // Less opacity to show the area clearly
      },
    },
    dataLabels: {
      enabled: false, // Disable data labels for cleaner look
    },
  };

  return (
    <div className="col-xxl-8">
      <div className="card h-100">
        <div className="card-body p-24 mb-8">
          <div className="d-flex align-items-center flex-wrap gap-2 justify-content-between">
            <h6 className="mb-2 fw-bold text-lg mb-0">Income Vs Expense</h6>
            <select
              className="form-select form-select-sm w-auto bg-base border text-secondary-light"
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
            >
              <option>Monthly</option>
              <option>Weekly</option>
              <option>Today</option>
            </select>
          </div>

          {/* Statistics Summary */}
          <div className="row my-4">
            <div className="col-md-6">
              <div className="d-flex flex-column gap-3">
              
                <div className="d-flex align-items-center gap-4">
                  <h3 className="mb-0 text-primary-600" style={{ fontSize: "10px" }}>
                    {new Intl.NumberFormat("en-TN", { style: "currency", currency: "TND" }).format(income)}
                  </h3>
                  <span className="text-success-600 d-flex align-items-center gap-1 text-sm fw-bold">
                    {incomeChange}%
                    <i className="ri-arrow-up-s-fill d-flex" />
                  </span>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="d-flex flex-column gap-3">
             
                <div className="d-flex align-items-center gap-4">
                  <h3 className="mb-0 text-warning-600" style={{ fontSize: "10px" }}>
                    {new Intl.NumberFormat("en-TN", { style: "currency", currency: "TND" }).format(expense)}
                  </h3>
                  <span className="text-danger-600 d-flex align-items-center gap-1 text-sm fw-bold">
                    {expenseChange}%
                    <i className="ri-arrow-down-s-fill d-flex" />
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div
            id="incomeExpense"
            className="apexcharts-tooltip-style-1 mb-5"
            style={{
              borderRadius: "10px", 
              padding: "20px", 
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", 
              backgroundColor: "#fff",
            }}
          >
            {loading ? (
              <div className="text-center">Loading...</div>
            ) : error ? (
              <div className="text-center text-danger">{error}</div>
            ) : (
              <ReactApexChart
                options={incomeExpenseOptions}
                series={incomeExpenseSeries}
                type="area"
                height={290}
                width={"100%"}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomeVsExpense;
