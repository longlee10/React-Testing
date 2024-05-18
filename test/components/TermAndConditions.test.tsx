import { render, screen } from "@testing-library/react";
import TermsAndConditions from "../../src/components/TermsAndConditions";
import React from "react";
import { it, expect, describe } from "vitest";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";

describe("Term And Conditions", () => {
  it("should render the correct interface", () => {
    render(<TermsAndConditions />);

    const heading = screen.getByRole("heading");
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("Terms & Conditions");

    const checkBox = screen.getByRole("checkbox");
    expect(checkBox).toBeInTheDocument();
    expect(checkBox).not.toBeChecked();

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  it("should enables the button when the check box is checked", async () => {
    render(<TermsAndConditions />);

    const checkBox = screen.getByRole("checkbox");
    const user = userEvent.setup();
    await user.click(checkBox);

    const button = screen.getByRole("button");
    expect(button).toBeEnabled();
  });
});
