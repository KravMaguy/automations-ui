// App.test.js
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom"; // Import the whole library

// import "@testing-library/jest-dom/extend-expect";
import App from "./App";

test('renders an h1 with "Automations"', () => {
  render(<App />);
  const h1Element = screen.getByText(/Automations/i);
  expect(h1Element).toBeInTheDocument();
});

test.skip("loads automations from chrome storage on mount", () => {
  const mockAutomations = [
    {
      name: "Test Automation",
      url: "https://www.example.com",
      status: null,
      tabIds: [],
    },
  ];
  chrome.storage.local.get.mockImplementation((key, callback) => {
    callback({ automations: mockAutomations });
  });

  render(<App />);

  expect(screen.getByText("Test Automation")).toBeInTheDocument();
});

test.skip("adds a new automation", () => {
  render(<App />);

  const inputName = screen.getByPlaceholderText("Automation Name");
  const inputUrl = screen.getByPlaceholderText("URL");
  const addButton = screen.getByText("Add Automation");

  // Simulate user input
  inputName.value = "New Automation";
  inputUrl.value = "https://www.new-url.com";
  inputName.dispatchEvent(new Event("input"));
  inputUrl.dispatchEvent(new Event("input"));

  addButton.click();

  expect(chrome.storage.local.set).toHaveBeenCalledWith({
    automations: [
      {
        name: "New Automation",
        url: "https://www.new-url.com",
        status: null,
        tabIds: [],
      },
    ],
  });
});
