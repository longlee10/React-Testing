import "@testing-library/jest-dom/vitest";
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import React from "react";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import ProductDetailPage from "../../src/pages/ProductDetailPage";
import AllProvider from "../AllProvider";
import path from "path";
import { createMemoryRouter } from "react-router-dom";
import routes from "../../src/routes";
import { db } from "../mocks/db";
import { navigateToAndRender } from "./Router.test";

describe("Product Detail Page", () => {
  it("should render product detail page", async () => {
    const product = db.product.create();
    navigateToAndRender(`/products/${product.id}`);

    await waitForElementToBeRemoved(() => screen.getByText(/loading/i));

    expect(
      screen.getByRole("heading", { name: product.name })
    ).toBeInTheDocument();
    expect(screen.getByText(`$${product.price}`)).toBeInTheDocument();
  });
});
