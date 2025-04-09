import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import useReactApexChart from "../../hook/useReactApexChart";

const FinancialOverview = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("Monthly");
  const { userOverviewDonutChartOptionsTwo } = useReactApexChart();
  const [chartOptions, setChartOptions] = useState(userOverviewDonutChartOptionsTwo);
  const [chartSeries, setChartSeries] = useState([30, 40, 25]);

  const [revenue, setRevenue] = useState(0);
  const [expenses, setExpenses] = useState(0);

  const data = {
    Monthly: { income: 2580.52, expense: 1247.19 },
    Weekly: { income: 645.13, expense: 311.79 },
    Today: { income: 92.16, expense: 45.38 },
    Yearly: { income: 30966.24, expense: 14966.28 }, // Calculated yearly from monthly x12
  };

  const updateChartData = (rev, exp) => {
    const net = rev - exp;
    const total = rev + exp + net || 1; // Avoid division by zero

    const series = [
      (rev / total) * 100,
      (exp / total) * 100,
      (net / total) * 100,
    ];

    setChartSeries(series);

    setChartOptions({
      ...chartOptions,
      colors: ["#4CAF50", "#003366", "#6EC5FF"],
      legend: {
        ...chartOptions.legend,
        labels: {
          ...chartOptions.legend.labels,
          items: [
            { name: "Revenue", color: "#4CAF50" },
            { name: "Expense", color: "#003366" },
            { name: "Net Income", color: "#6EC5FF" },
          ],
        },
      },
    });
  };

  useEffect(() => {
    const { income = 0, expense = 0 } = data[selectedPeriod] || {};
    setRevenue(income);
    setExpenses(expense);
    updateChartData(income, expense);
  }, [selectedPeriod]);

  const handlePeriodChange = (e) => {
    setSelectedPeriod(e.target.value);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-TN", {
      style: "currency",
      currency: "TND",
      minimumFractionDigits: 2,
    }).format(value);
  };

  const netIncome = revenue - expenses;

  return (
    <div className="col-12">
      <div className="card radius-12">
        <div className="card-header">
          <div className="d-flex align-items-center flex-wrap gap-2 justify-content-between">
            <h6 className="mb-2 fw-bold text-lg">Financial Overview</h6>
            <select
              className="form-select form-select-sm w-auto bg-base border text-secondary-light"
              value={selectedPeriod}
              onChange={handlePeriodChange}
            >
              <option>Monthly</option>
              <option>Weekly</option>
              <option>Today</option>
            </select>
          </div>
        </div>
        <div className="card-body p-24">
          <div className="mt-32">
            <div id="userOverviewDonutChart" className="mx-auto apexcharts-tooltip-z-none">
              <ReactApexChart
                options={chartOptions}
                series={chartSeries}
                type="donut"
                height={270}
              />
            </div>
          </div>

          <div className="d-flex flex-wrap gap-20 justify-content-center mt-48">
            <div className="d-flex align-items-center gap-8">
              <span className="w-16-px h-16-px radius-2" style={{ backgroundColor: "#4CAF50" }} />
              <span className="text-secondary-light">
                Net Income: {formatCurrency(netIncome)} ({chartSeries[0]?.toFixed(2)}%)
              </span>
            </div>
            <div className="d-flex align-items-center gap-8">
              <span className="w-16-px h-16-px radius-2" style={{ backgroundColor: "#003366" }} />
              <span className="text-secondary-light">
                Expenses: {formatCurrency(expenses)} ({chartSeries[1]?.toFixed(2)}%)
              </span>
            </div>
            <div className="d-flex align-items-center gap-8">
              <span className="w-16-px h-16-px radius-2" style={{ backgroundColor: "#6EC5FF" }} />
              <span className="text-secondary-light">
                Revenue: {formatCurrency(revenue)} ({chartSeries[2]?.toFixed(2)}%)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialOverview;
