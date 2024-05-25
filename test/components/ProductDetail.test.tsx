import "@testing-library/jest-dom/vitest";
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { http, HttpResponse, delay } from "msw";
import React from "react";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import ProductDetail from "../../src/components/ProductDetail";
import { db } from "../mocks/db";
import { server } from "../mocks/server";
import AllProvider from "../AllProvider";

export type Product = {
  id: number;
  name: string;
  price: number;
};

describe("Product detail", () => {
  let product: Product;

  beforeAll(() => {
    product = db.product.create();
  });

  afterAll(() => {
    db.product.delete({ where: { id: { equals: product.id } } });
  });

  const renderComponent = (id: number) => {
    render(<ProductDetail productId={id} />, { wrapper: AllProvider });

    return {
      getProductName: () => screen.findByText(new RegExp(product.name)),
      getProductPrice: () =>
        screen.findByText(new RegExp(product.price.toString())),
      getInvalid: () => screen.findByText(/invalid/i),
      getMessage: () => screen.findByText(/not found/i),
      getError: () => screen.findByText(/error/i),
      getLoading: () => screen.findByText(/loading/i),
    };
  };

  it("should render the actual product if id is valid", async () => {
    const { getProductName, getProductPrice } = renderComponent(product.id);

    expect(await getProductName()).toBeInTheDocument();
    expect(await getProductPrice()).toBeInTheDocument();
  });

  it("should display error if the id is not valid", async () => {
    const { getInvalid } = renderComponent(0);

    expect(await getInvalid()).toBeInTheDocument();
  });

  it("should display not found if no product returned", async () => {
    server.use(http.get("/products/1", () => HttpResponse.json(null)));

    const { getMessage } = renderComponent(1);

    expect(await getMessage()).toBeInTheDocument();
  });

  it("should display error if an error occurred", async () => {
    server.use(http.get("/products/1", () => HttpResponse.error()));

    const { getError } = renderComponent(1);

    expect(await getError()).toBeInTheDocument();
  });

  it("should render loading indicator while fetching data", async () => {
    server.use(
      http.get("/products/1", async () => {
        await delay();
        return HttpResponse.json(null);
      })
    );

    const { getLoading } = renderComponent(1);

    expect(await getLoading()).toBeInTheDocument();
  });

  it("should remove the loaidng indicator if data fetching succeed", async () => {
    renderComponent(product.id);

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  });

  it("should remove the loaidng indicator if data fetching failed", async () => {
    server.use(http.get(`/product/${product.id}`, () => HttpResponse.error()));

    renderComponent(product.id);

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  });
});
