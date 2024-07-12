import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test('renders an h1 with "Automations"', () => {
  render(<App />);
  const h1Element = screen.getByText(/Automations/i);
  expect(h1Element).toBeInTheDocument();
});
