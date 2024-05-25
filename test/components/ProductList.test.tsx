import "@testing-library/jest-dom/vitest";
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { delay, http, HttpResponse } from "msw";
import React from "react";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import ProductList from "../../src/components/ProductList";
import AllProvider from "../AllProvider";
import { db } from "../mocks/db";
import { server } from "../mocks/server";

describe("Product List", () => {
  const productIds: number[] = [];

  beforeAll(() => {
    [1, 2, 3].forEach(() => {
      const product = db.product.create();
      productIds.push(product.id);
    });
  });

  afterAll(() => {
    db.product.deleteMany({ where: { id: { in: productIds } } });
  });

  const renderComponent = () => {
    render(<ProductList />, { wrapper: AllProvider });
  };

  it("should render the list of products", async () => {
    renderComponent();

    const items = await screen.findAllByRole("listitem");
    expect(items.length).toBeGreaterThan(0);
  });

  it("should render no product message if the product array is empty", async () => {
    server.use(http.get("/products", () => HttpResponse.json([]))); // overriding the original function

    renderComponent();

    const message = await screen.findByText(/no products/i);
    expect(message).toBeInTheDocument();
  });

  it("should render error message", async () => {
    server.use(http.get("/products", () => HttpResponse.error()));

    renderComponent();

    const error = await screen.findByText(/error/i);
    expect(error).toBeInTheDocument();
  });

  it("should display loading indicator while waiting for the data", async () => {
    server.use(
      http.get("/products", async () => {
        await delay();
        return HttpResponse.json([]);
      })
    );

    renderComponent();

    const loading = await screen.findByText(/loading/i);
    expect(loading).toBeInTheDocument();
  });

  it("should remove the loading indicator if data is fetched successfully", async () => {
    server.use(http.get("/products", () => HttpResponse.json([])));

    renderComponent();

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  });

  it("should remove the loading indicator if data fetching failed", async () => {
    server.use(
      http.get("/products", async () => {
        await delay();
        return HttpResponse.error();
      })
    );

    renderComponent();

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  });
});
