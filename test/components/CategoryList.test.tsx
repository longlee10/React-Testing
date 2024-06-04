import "@testing-library/jest-dom/vitest";
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import CategoryList from "../../src/components/CategoryList";
import AllProvider from "../AllProvider";
import { Category } from "../../src/entities";
import { db } from "../mocks/db";
import { simulateError } from "../utils";

describe("Category list", () => {
  const categories: Category[] = [];

  beforeAll(() => {
    [1, 2, 3].forEach(() => {
      categories.push(db.categories.create());
    });
  });

  afterAll(() => {
    const categoryIds = categories.map((c) => c.id);
    db.categories.deleteMany({ where: { id: { in: categoryIds } } });
  });

  const renderComponent = () => {
    render(<CategoryList />, { wrapper: AllProvider });
  };

  it("should render loading message", async () => {
    renderComponent();

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("should render the list of categories", async () => {
    renderComponent();

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));

    categories.forEach((c) => {
      expect(screen.getByText(c.name)).toBeInTheDocument();
    });
  });

  it("should render error message", async () => {
    simulateError("/categories");
    renderComponent();

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));

    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });
});
