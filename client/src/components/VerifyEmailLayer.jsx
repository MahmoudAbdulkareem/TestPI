import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const VerifyEmailPage = () => {
    const { token } = useParams(); // Retrieve the token from the URL
    const navigate = useNavigate(); // Hook to navigate to other routes
    const [loading, setLoading] = useState(true); // Loading state for verification process

    useEffect(() => {
        const verifyEmail = async () => {
            if (!token) return; // Ensure that a token is provided in the URL

            try {
                const response = await axios.post(
                    `http://localhost:5001/api/users/verify-email/${token}`
                );

                toast.success('Your email has been verified successfully!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });

                // Navigate to the sign-in page after verification
                navigate('/sign-in', { replace: true });

            } catch (error) {
                console.error('Error verifying email:', error.response ? error.response.data : error.message);

                toast.error('Verification failed. Please try again.', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            } finally {
                setLoading(false); // Set loading state to false once the process is complete
            }
        };

        verifyEmail(); // Call the verifyEmail function when the component mounts
    }, [token, navigate]);

    return (
        <div className="verify-email-container">
            {loading ? (
                <p>Verifying your email...</p> // Show loading message while waiting for the response
            ) : (
                <p>Your email has been successfully verified! Redirecting to sign-in...</p> // Success message
            )}
        </div>
    );
};

export default VerifyEmailPage;
