import React from "react";
import { render, screen } from '@testing-library/react';
import Login from "../pages/login";
import { BrowserRouter } from "react-router-dom";




test('check button', () => {
    const { getByText } = render(
        <BrowserRouter>
            <Login />
        </BrowserRouter>
    );
    const button = getByText("Login to your account");
    expect(button).toBeTruthy()
});