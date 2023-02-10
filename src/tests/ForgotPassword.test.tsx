import React from "react";
import { render, screen } from '@testing-library/react';
import ForgotPassword from "../pages/forgot-password";
import { BrowserRouter } from "react-router-dom";



test('check button', () => {
    const { getByText } = render(
        <BrowserRouter>
            <ForgotPassword />
        </BrowserRouter>
    );
    const button = getByText("Reset Password");
    expect(button).toBeTruthy()
});

