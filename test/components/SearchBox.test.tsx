import { render, screen } from "@testing-library/react";
import SearchBox from "../../src/components/SearchBox";
import React from "react";
import { it, expect, describe, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";

describe("Search Box", () => {
  const renderComponent = () => {
    const onChange = vi.fn();
    render(<SearchBox onChange={onChange} />);

    return {
      input: screen.queryByPlaceholderText(/search/i),
      onChange,
      user: userEvent.setup(),
    };
  };

  it("should render the input field", () => {
    const { input } = renderComponent();

    expect(input).toBeInTheDocument();
  });

  it("should call the function that is passed to the component", async () => {
    const { input, onChange, user } = renderComponent();

    const searchTerm = "search";
    await user.type(input!, `${searchTerm}{enter}`);

    expect(onChange).toHaveBeenCalledWith(searchTerm);
  });

  it("should not call the function that is passed to the component if input is empty", async () => {
    const { input, onChange, user } = renderComponent();

    await user.type(input!, `{enter}`);

    expect(onChange).not.toHaveBeenCalled();
  });
});
