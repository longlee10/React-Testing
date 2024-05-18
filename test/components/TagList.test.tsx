import "@testing-library/jest-dom/vitest";
import { render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";
import TagList from "../../src/components/TagList";

describe("Tag List", () => {
  it("should render a list of tags", async () => {
    render(<TagList />);

    const listItems = await screen.findAllByRole("listitem"); // this function waits until tags is rendered then query
    expect(listItems.length).toBeGreaterThan(0);

    await waitFor(() => {
      const listItems = screen.getAllByRole("listitem"); // this function does not wait -> have to wrap it inside waitFor
      expect(listItems.length).toBeGreaterThan(0);
    });
  });
});
