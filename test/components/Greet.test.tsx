import { render, screen } from "@testing-library/react";
import Greet from "../../src/components/Greet";
import React from "react";
import { it, expect, describe } from "vitest";
import "@testing-library/jest-dom/vitest";

describe("Greet", () => {
  it("should render Hello with the name if name is provided", () => {
    render(<Greet name="Mosh" />);

    const heading = screen.getByRole("heading");
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(/mosh/i);
  });

  it("should render login button if the name is not provided", () => {
    render(<Greet />);

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(/login/i);
  });
});
