import { render, screen } from "@testing-library/react";
import UserAccount from "../../src/components/UserAccount";
import React from "react";
import { it, expect, describe } from "vitest";
import "@testing-library/jest-dom/vitest";
import { User } from "../../src/entities";

describe("User Account", () => {
  it("should return name of the user in the DOM", () => {
    const user: User = { id: 1, name: "Mosh" };
    render(<UserAccount user={user} />);

    expect(screen.getByText(user.name)).toBeInTheDocument();
  });

  it("should return the button if the user is admin", () => {
    const user: User = { id: 1, name: "Mosh", isAdmin: true };
    render(<UserAccount user={user} />);

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(/edit/i);
  });

  it("should not return the button if the user is not an admin", () => {
    const user: User = { id: 1, name: "Mosh" };
    render(<UserAccount user={user} />);

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
