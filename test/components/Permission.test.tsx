import { render, screen } from "@testing-library/react";
import Permission from "../../src/components/practice/Permission";
import React from "react";
import { it, expect, describe } from "vitest";
import "@testing-library/jest-dom/vitest";
import { User } from "../../src/components/practice/Permission";

describe("Permission", () => {
  it("should display the name of the user in the DOM", () => {
    const user: User = { name: "User" };
    render(<Permission user={user} />);

    expect(screen.getByText("User")).toBeInTheDocument();
  });

  it("should display the delete button if the user is admin", () => {
    const user: User = { name: "User", isAdmin: true };
    render(<Permission user={user} />);

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(/delete/i);
  });

  it("should not display the delete button if the user is not admin", () => {
    const user: User = { name: "User" };
    render(<Permission user={user} />);

    const button = screen.queryByRole("button");
    expect(button).not.toBeInTheDocument();
  });

  it("should display the link to mimick the user if is admin", () => {
    const user: User = { name: "User", isAdmin: true };
    render(<Permission user={user} />);

    const link = screen.getByRole("link");
    expect(link).toBeInTheDocument();
    expect(link.getAttribute("href")).toBe(`user/${user.name}`);
  });

  it("should not display the link to mimick the user if is not admin", () => {
    const user: User = { name: "User" };
    render(<Permission user={user} />);

    const link = screen.queryByRole("link");
    expect(link).not.toBeInTheDocument();
  });
});
