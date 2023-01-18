import React from "react";
import { render, screen } from '@testing-library/react';
import ForgotPassword from "../forgot-password";

test('renders some text', () => {
    render(<ForgotPassword />);
    const linkElement = screen.getByText(/Slightly Techie/i);
    expect(linkElement).toBeInTheDocument();
    
})