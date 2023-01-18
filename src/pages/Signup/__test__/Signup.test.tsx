import React from "react";
import { render, screen } from '@testing-library/react';
import SignUp from "../signup";

test('renders some text', () => {
    render(<SignUp />);
    const linkElement = screen.getByText(/Slightly Techie/i);
    expect(linkElement).toBeInTheDocument();
    
})