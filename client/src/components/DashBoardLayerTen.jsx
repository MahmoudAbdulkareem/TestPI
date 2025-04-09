import React from "react";
import IncomeStatement  from "./child/IncomeStatement ";
import IncomeVsExpense from "./child/IncomeVsExpense";
import UsersChart from "./child/UsersChart";
import TopExpenses from "./child/TopExpenses";
import TopCustomer from "./child/TopCustomer";
import FinancialOverview from "./child/FinancialOverview";
import PurchaseAndSales from "./child/PurchaseAndSales";
import RecentTransactions from "./child/RecentTransactions";

const DashBoardLayerTen = () => {
  return (
    <div className='row gy-4'>
      {/* IncomeStatement  */}
      <IncomeStatement   />

      {/* IncomeVsExpense */}
      <IncomeVsExpense />

      {/* TopExpenses */}
      <TopExpenses />

      {/* FinancialOverview */}
      <FinancialOverview />

      {/* RecentTransactions */}
      <RecentTransactions />
    </div>
  );
};

export default DashBoardLayerTen;
