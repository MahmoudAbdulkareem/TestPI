import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import VerifyEmailLayer from "../components/VerifyEmailLayer"; // Make sure to create this component

const VerifyEmailPage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        
        {/* Breadcrumb */}
        <Breadcrumb title="Verify Email" />

        {/* VerifyEmailLayer */}
        <VerifyEmailLayer /> {/* Handle the email verification logic inside this component */}
        
      </MasterLayout>
    </>
  );
};

export default VerifyEmailPage;
