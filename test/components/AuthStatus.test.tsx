import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, beforeAll, afterAll } from "vitest";
import AuthStatus from "../../src/components/AuthStatus";
import { AuthState, mockAuthState } from "../utils";

describe("Auth status", () => {
  const initialUserState: AuthState = {
    isAuthenticated: false,
    isLoading: true,
    user: undefined,
  };

  const renderComponent = (state: AuthState) => {
    mockAuthState(state);

    render(<AuthStatus />);
  };

  it("should display the loading message", () => {
    renderComponent({ ...initialUserState });

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("should display user name and log out button", () => {
    renderComponent({
      isAuthenticated: true,
      isLoading: false,
      user: { name: "Alex" },
    });

    expect(screen.getByText("Alex")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /log out/i })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /log in/i })
    ).not.toBeInTheDocument();
  });

  it("should render login button", () => {
    renderComponent({ ...initialUserState, isLoading: false });

    expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /log out/i })
    ).not.toBeInTheDocument();
  });
});
