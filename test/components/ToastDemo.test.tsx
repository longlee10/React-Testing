import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";
import ToastDemo from "../../src/components/ToastDemo";
import { Toaster } from "react-hot-toast";
import userEvent from "@testing-library/user-event";

describe("Toast Demo", () => {
  const renderComponent = () => {
    render(
      <>
        <ToastDemo />
        <Toaster />
      </>
    );

    return {
      button: screen.getByRole("button"),
    };
  };

  it("should render the show toast button", () => {
    const { button } = renderComponent();

    expect(button).toBeInTheDocument();
  });

  it("should show toast notification after the user click on the button", async () => {
    const { button } = renderComponent();
    const user = userEvent.setup();

    await user.click(button);

    const toast = await screen.findByText(/success/i);
    expect(toast).toBeInTheDocument();
  });
});
