import { render, screen } from "@testing-library/react";
import UserList from "../../src/components/UserList";
import React from "react";
import { it, expect, describe } from "vitest";
import "@testing-library/jest-dom/vitest";
import { User } from "../../src/entities";

describe("User List", () => {
  it("should return no users if the user list is empty", () => {
    render(<UserList users={[]} />);

    expect(screen.getByText(/no users/i)).toBeInTheDocument();
  });

  it("should return a list of link to user with correct href attribute", () => {
    const users: User[] = [
      { id: 1, name: "User1" },
      { id: 2, name: "User2" },
    ];

    render(<UserList users={users} />);

    users.forEach((user) => {
      const link = screen.getByRole("link", { name: user.name });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", `/users/${user.id}`);
    });
  });
});
