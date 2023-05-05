import React from "react";
import { render, screen } from "@testing-library/react";
import SignUp from "../pages/auth/Signup/signup";
import { BrowserRouter } from "react-router-dom";

test("check button", () => {
  const { getByText } = render(
    <BrowserRouter>
      <SignUp />
    </BrowserRouter>
  );
  const button = getByText("Create your account");
  expect(button).toBeTruthy();
});
