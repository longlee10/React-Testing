import "@testing-library/jest-dom/vitest";
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import React from "react";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import routes from "../../src/routes";
import { db } from "../mocks/db";
import { Product } from "../../src/entities";

describe("Router", () => {
  let product: Product;

  beforeAll(() => {
    product = db.product.create();
  });

  afterAll(() => {
    db.product.delete({ where: { id: { equals: product.id } } });
  });

  it("should render the home page at /home", () => {
    navigateToAndRender("/");
    expect(screen.getByRole("heading", { name: /home/i })).toBeInTheDocument();
  });

  it("should render the products page at /products", () => {
    navigateToAndRender("/products");

    expect(
      screen.getByRole("heading", { name: /products/i })
    ).toBeInTheDocument();
  });

  it("should render product details page at /products/:id", async () => {
    const { getLoading } = navigateToAndRender(`/products/${product.id}`);

    await waitForElementToBeRemoved(getLoading);

    expect(
      screen.getByRole("heading", { name: product.name })
    ).toBeInTheDocument();
  });

  it("should render not found page at invalid route", async () => {
    navigateToAndRender(`!`);

    expect(screen.getByText(/not found/i)).toBeInTheDocument();
  });

  it("should render admin page at /admin", async () => {
    navigateToAndRender(`/admin`);

    expect(screen.getByText(/admin area/i)).toBeInTheDocument();
  });

  it("should render new product page", () => {
    navigateToAndRender("/admin/products/new");

    expect(screen.getByText(/new product/i)).toBeInTheDocument();
  });

  it("should render edit product page", async () => {
    const { getLoading } = navigateToAndRender(
      `/admin/products/${product.id}/edit`
    );

    await waitForElementToBeRemoved(getLoading);
    expect(screen.getByText(/edit product/i)).toBeInTheDocument();
  });
});

export const navigateToAndRender = (path: string) => {
  const router = createMemoryRouter(routes, { initialEntries: [path] });

  render(<RouterProvider router={router} />);

  return {
    getLoading: () => screen.getByText(/loading/i),
  };
};
