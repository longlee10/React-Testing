import { Theme } from "@radix-ui/themes";
import "@testing-library/jest-dom/vitest";
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import React from "react";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { Category, Product } from "../../src/entities";
import BrowseProducts from "../../src/pages/BrowseProductsPage";
import { CartProvider } from "../../src/providers/CartProvider";
import { db, getProductByCategory } from "../mocks/db";
import { server } from "../mocks/server";
import { simulateDelay, simulateError } from "../utils";
import AllProvider from "../AllProvider";
import { wrap } from "module";

describe("Browse Products", () => {
  const categories: Category[] = [];
  const products: Product[] = [];

  beforeAll(() => {
    [1, 2].forEach((item) => {
      const category = db.categories.create({ name: `Category ${item}` });
      categories.push(category);
      [1, 2].forEach(() => {
        products.push(db.product.create({ categoryId: category.id }));
      });
    });
  });

  afterAll(() => {
    const categoryIds = categories.map((c) => c.id);
    db.categories.deleteMany({ where: { id: { in: categoryIds } } });

    const productIds = products.map((p) => p.id);
    db.product.deleteMany({ where: { id: { in: productIds } } });
  });

  it("should render the skeleton while fetching categories", async () => {
    simulateDelay("/categories");

    const { getCategorySkeleton } = renderComponent();

    expect(getCategorySkeleton()).toBeInTheDocument();
  });

  it("should remove the skeleton if fetching categories successfully", async () => {
    const { getCategorySkeleton } = renderComponent();

    await waitForElementToBeRemoved(getCategorySkeleton);
  });

  it("should remove the skeleton if fetching categories failed", async () => {
    simulateError("/categories");

    const { getCategorySkeleton } = renderComponent();

    await waitForElementToBeRemoved(getCategorySkeleton);
  });

  it("should render a skeleton while fetching products", async () => {
    simulateDelay("/products");

    const { getProductSkeleton } = renderComponent();

    expect(getProductSkeleton()).toBeInTheDocument();
  });

  it("should remove the skeleton if fetching products successfully", async () => {
    const { getProductSkeleton } = renderComponent();

    await waitForElementToBeRemoved(getProductSkeleton);
  });

  it("should remove the skeleton if fetching products failed", async () => {
    simulateError("/products");

    const { getProductSkeleton } = renderComponent();

    await waitForElementToBeRemoved(getProductSkeleton);
  });

  // test behavior if fetching fails
  it("should not display the category select if fetching fails", async () => {
    server.use(http.get("/products", async () => HttpResponse.json([])));
    simulateError("/categories");

    const { getCategorySkeleton, getCategorySelect } = renderComponent();

    await waitForElementToBeRemoved(getCategorySkeleton);

    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
    expect(getCategorySelect()).not.toBeInTheDocument();
  });

  it("should display the error if fetching product fails", async () => {
    simulateError("/products");

    renderComponent();

    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });

  // test rendering data in case fetching succeed
  it("should render the categories dropdown with correct options", async () => {
    server.use(http.get("/categories", () => HttpResponse.json(categories)));

    const { getCategorySkeleton } = renderComponent();
    await waitForElementToBeRemoved(getCategorySkeleton);

    const comboBox = await screen.findByRole("combobox");

    const user = userEvent.setup();
    await user.click(comboBox);

    expect(screen.getByRole("option", { name: /all/i })).toBeInTheDocument();
    categories.forEach((c) =>
      expect(screen.getByRole("option", { name: c.name })).toBeInTheDocument()
    );
  });

  it("should render this list of products", async () => {
    server.use(http.get("/products", () => HttpResponse.json(products)));
    const { getProductSkeleton } = renderComponent();

    await waitForElementToBeRemoved(getProductSkeleton);

    products.forEach((p) => {
      expect(screen.getByText(p.name)).toBeInTheDocument();
    });
  });

  // test filtering
  it("should render correct option after filtering", async () => {
    // server.use(http.get("/categories", () => HttpResponse.json(categories)));
    const { expectProductsToBeInTheDocument, selectCategory } =
      renderComponent();

    await selectCategory(categories[0].name);

    const selectedCategory = categories[0];
    const selectedProducts = getProductByCategory(selectedCategory.id);

    expectProductsToBeInTheDocument(selectedProducts);
  });

  it("should render all products when user select all option", async () => {
    //  server.use(http.get("/categories", () => HttpResponse.json(categories)));
    const { expectProductsToBeInTheDocument, selectCategory } =
      renderComponent();

    await selectCategory(/all/i);

    expectProductsToBeInTheDocument(products);
  });
});

const renderComponent = () => {
  render(<BrowseProducts />, { wrapper: AllProvider });

  const getCategorySkeleton = () =>
    screen.getByRole("progressbar", { name: /categories/i });

  const getProductSkeleton = () =>
    screen.getByRole("progressbar", { name: /products/i });

  const getCategorySelect = () =>
    screen.queryByRole("combobox", { name: /category/i });

  const selectCategory = async (selectedOption: string | RegExp) => {
    await waitForElementToBeRemoved(getCategorySkeleton);
    const comboBox = await screen.findByRole("combobox");
    const user = userEvent.setup();
    await user.click(comboBox);

    const option = screen.getByRole("option", { name: selectedOption });
    await user.click(option);
  };

  const expectProductsToBeInTheDocument = (selectedProducts: Product[]) => {
    const rows = screen.queryAllByRole("row");
    const dataRows = rows.slice(1);
    expect(dataRows.length).toBe(selectedProducts.length);

    selectedProducts.forEach((p) => {
      expect(screen.getByText(p.name)).toBeInTheDocument();
    });
  };

  return {
    getCategorySkeleton,
    getProductSkeleton,
    getCategorySelect,
    selectCategory,
    expectProductsToBeInTheDocument,
  };
};
