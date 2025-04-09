import React from "react";

const IncomeStatement = () => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-TN", {
      style: "currency",
      currency: "TND",
      minimumFractionDigits: 2,
    }).format(value);
  };

  const totalRevenue = 18000;
  const totalExpenses = 6000;
  const netIncome = totalRevenue - totalExpenses;

  return (
    <div className="col-12">
      <div className="card radius-12">
        <div className="card-body p-16">
          <div className="row gy-4">
            {/* Total Revenue */}
            <div className="col-xxl-3 col-xl-3 col-sm-6">
              <div className="px-20 py-16 shadow-none radius-8 h-100 gradient-deep-1 left-line line-bg-primary position-relative overflow-hidden">
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-1 mb-8">
                  <div>
                    <span className="mb-2 fw-medium text-secondary-light text-md">
                      Total Revenue
                    </span>
                    <h6 className="fw-semibold mb-1">{formatCurrency(totalRevenue)}</h6>
                  </div>
                  <span className="w-44-px h-44-px radius-8 d-inline-flex justify-content-center align-items-center text-2xl mb-12 bg-primary-100 text-primary-600">
                    <i className="ri-dollar-circle-fill" />
                  </span>
                </div>
                <p className="text-sm mb-0">
                  <span className="bg-success-focus px-1 rounded-2 fw-medium text-success-main text-sm">
                    <i className="ri-arrow-right-up-line" /> 80%
                  </span>{" "}
                  From last year{" "}
                </p>
              </div>
            </div>

            {/* Total Expenses */}
            <div className="col-xxl-3 col-xl-3 col-sm-6">
              <div className="px-20 py-16 shadow-none radius-8 h-100 gradient-deep-2 left-line line-bg-lilac position-relative overflow-hidden">
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-1 mb-8">
                  <div>
                    <span className="mb-2 fw-medium text-secondary-light text-md">
                      Total Expenses
                    </span>
                    <h6 className="fw-semibold mb-1">{formatCurrency(totalExpenses)}</h6>
                  </div>
                  <span className="w-44-px h-44-px radius-8 d-inline-flex justify-content-center align-items-center text-2xl mb-12 bg-lilac-200 text-lilac-600">
                    <i className="ri-wallet-fill" />
                  </span>
                </div>
                <p className="text-sm mb-0">
                  <span className="bg-success-focus px-1 rounded-2 fw-medium text-success-main text-sm">
                    <i className="ri-arrow-right-up-line" /> 60%
                  </span>{" "}
                  From last year{" "}
                </p>
              </div>
            </div>

            {/* Net Income */}
            <div className="col-xxl-3 col-xl-3 col-sm-6">
              <div className="px-20 py-16 shadow-none radius-8 h-100 gradient-deep-3 left-line line-bg-success position-relative overflow-hidden">
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-1 mb-8">
                  <div>
                    <span className="mb-2 fw-medium text-secondary-light text-md">
                      Net Income
                    </span>
                    <h6 className="fw-semibold mb-1">{formatCurrency(netIncome)}</h6>
                  </div>
                  <span className="w-44-px h-44-px radius-8 d-inline-flex justify-content-center align-items-center text-2xl mb-12 bg-success-200 text-success-600">
                    <i className="ri-checkbox-circle-fill" />
                  </span>
                </div>
                <p className="text-sm mb-0">
                  <span className="bg-success-focus px-1 rounded-2 fw-medium text-success-main text-sm">
                    <i className="ri-arrow-right-up-line" /> 75%
                  </span>{" "}
                  From last year{" "}
                </p>
              </div>
            </div>

            {/* Total Transactions */}
            <div className="col-xxl-3 col-xl-3 col-sm-6">
              <div className="px-20 py-16 shadow-none radius-8 h-100 gradient-deep-4 left-line line-bg-info position-relative overflow-hidden">
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-1 mb-8">
                  <div>
                    <span className="mb-2 fw-medium text-secondary-light text-md">
                      Total Transactions
                    </span>
                    <h6 className="fw-semibold mb-1">35</h6>
                  </div>
                  <span className="w-44-px h-44-px radius-8 d-inline-flex justify-content-center align-items-center text-2xl mb-12 bg-info-200 text-info-600">
                    <i className="ri-exchange-dollar-fill" />
                  </span>
                </div>
                <p className="text-sm mb-0">
                  <span className="bg-success-focus px-1 rounded-2 fw-medium text-success-main text-sm">
                    <i className="ri-arrow-right-up-line" /> 10%
                  </span>{" "}                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomeStatement;
