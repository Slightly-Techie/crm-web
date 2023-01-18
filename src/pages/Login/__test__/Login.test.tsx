import React from "react";
import { render, screen } from '@testing-library/react';
import Login from "../login";

test('renders login', () => {
    render(<Login />);
    const linkElement = screen.getByText(/Slightly Techie/i);
    expect(linkElement).toBeInTheDocument();
})