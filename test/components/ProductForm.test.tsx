import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import ProductForm from "../../src/components/ProductForm";
import { Category, Product } from "../../src/entities";
import AllProvider from "../AllProvider";
import { db } from "../mocks/db";
import { Toaster } from "react-hot-toast";

describe("Product Form", () => {
  const categories: Category[] = [];

  beforeAll(() => {
    [1, 2, 3].forEach((item) => {
      const category = db.categories.create({ name: `Category ${item}` });
      categories.push(category);
    });
  });

  afterAll(() => {
    const categoryIds = categories.map((c) => c.id);
    db.categories.deleteMany({ where: { id: { in: categoryIds } } });
  });

  const renderComponent = (product?: Product) => {
    const onSubmit = vi.fn();
    render(
      <>
        <ProductForm product={product} onSubmit={onSubmit} />
        <Toaster />
      </>,
      {
        wrapper: AllProvider,
      }
    );

    const waitForFormToLoad = async () => {
      await screen.findByRole("form");

      const nameInput = screen.getByPlaceholderText(/name/i);
      const priceInput = screen.getByPlaceholderText(/price/i);
      const categoryInput = screen.getByRole("combobox", { name: /category/i });
      const submitButton = screen.getByRole("button", { name: /submit/i });

      type FormData = {
        [K in keyof Product]: any;
      };

      const validData: FormData = {
        id: 1,
        name: "a",
        price: 1,
        categoryId: categories[0].id,
      };

      const fill = async (product: FormData) => {
        const user = userEvent.setup();

        if (product.name) await user.type(nameInput, product.name);

        if (product.price)
          await user.type(priceInput, product.price.toString());

        await user.tab();
        await user.click(categoryInput);
        const options = screen.getAllByRole("option");
        await user.click(options[0]);
        await user.click(submitButton);
      };

      return {
        nameInput,
        priceInput,
        categoryInput,
        submitButton,
        optionByName: (name: string) => screen.getByRole("option", { name }),
        fill,
        validData,
        onSubmit,
      };
    };

    const expectErrorMessage = (errorMessage: RegExp) => {
      const error = screen.getByRole("alert");
      expect(error).toBeInTheDocument();
      expect(error).toHaveTextContent(errorMessage);
    };

    return {
      waitForFormToLoad,
      expectErrorMessage,
      onSubmit,
    };
  };

  it.skip("should render all neccessary fields in the form", async () => {
    const { waitForFormToLoad } = renderComponent();

    const { nameInput, priceInput, categoryInput, optionByName } =
      await waitForFormToLoad();

    expect(nameInput).toBeInTheDocument();
    expect(priceInput).toBeInTheDocument();
    expect(categoryInput).toBeInTheDocument();

    // test the option rendering
    const user = userEvent.setup();
    await user.click(categoryInput);

    categories.forEach((c) => {
      expect(optionByName(c.name)).toBeInTheDocument();
    });
  });

  it.skip("should render correct values if a product is passed to the form", async () => {
    const product: Product = {
      id: 1,
      name: "Bread",
      price: 10,
      categoryId: categories[0].id,
    };

    const { waitForFormToLoad } = renderComponent(product);

    const { nameInput, priceInput, categoryInput } = await waitForFormToLoad();

    expect(nameInput).toHaveValue(product.name);
    expect(priceInput).toHaveValue(product.price.toString());
    expect(categoryInput).toHaveTextContent(categories[0].name);
  });

  it.skip("should focus on the name field when the page first load", async () => {
    const { waitForFormToLoad } = renderComponent();

    const { nameInput } = await waitForFormToLoad();

    expect(nameInput).toHaveFocus();
  });

  it.skip.each([
    {
      scenario: "name empty",
      errorMessage: /required/i,
    },
    { scenario: "name is a white space", name: " ", errorMessage: /required/i },
    {
      scenario: "name longer than 255 characters",
      name: "a".repeat(256),
      errorMessage: /255/i,
    },
  ])("should display error when $scenario", async ({ name, errorMessage }) => {
    const { waitForFormToLoad, expectErrorMessage } = renderComponent();

    const form = await waitForFormToLoad();
    await form.fill({ ...form.validData, name });

    expectErrorMessage(errorMessage);
  });

  it.skip.each([
    { scenario: "price is empty", errorMessage: /required/i },
    { scenario: "price is invalid", price: "a", errorMessage: /required/i },
    { scenario: "price is = 0", price: 0, errorMessage: /required/i },
    { scenario: "price is < 1", price: -1, errorMessage: /greater/i },
    { scenario: "price is > 1000", price: 1001, errorMessage: /less/i },
  ])("should display error when $scenario", async ({ price, errorMessage }) => {
    const { waitForFormToLoad, expectErrorMessage } = renderComponent();

    const form = await waitForFormToLoad();
    await form.fill({ ...form.validData, price });

    expectErrorMessage(errorMessage);
  });

  // test form submission
  it.skip("should call the submit function with the right argument", async () => {
    const { waitForFormToLoad, onSubmit } = renderComponent();
    const form = await waitForFormToLoad();
    await form.fill({ ...form.validData });

    const { id, ...formData } = form.validData;
    expect(onSubmit).toHaveBeenCalledWith(formData);
  });

  it.skip("should display error if submission fails", async () => {
    const { waitForFormToLoad, onSubmit } = renderComponent();
    onSubmit.mockRejectedValue({});

    const form = await waitForFormToLoad();
    await form.fill({ ...form.validData });

    const toast = await screen.findByRole("status");
    expect(toast).toBeInTheDocument();
    expect(toast).toHaveTextContent(/error/i);
  });

  it.skip("should disable submit button upon submision", async () => {
    const { waitForFormToLoad, onSubmit } = renderComponent();
    onSubmit.mockReturnValue(new Promise(() => {}));

    const form = await waitForFormToLoad();
    await form.fill({ ...form.validData });

    expect(form.submitButton).toBeDisabled();
  });

  it.skip("should re-enable submit button after successful submision", async () => {
    const { waitForFormToLoad, onSubmit } = renderComponent();
    onSubmit.mockResolvedValue({});

    const form = await waitForFormToLoad();
    await form.fill({ ...form.validData });

    expect(form.submitButton).not.toBeDisabled();
  });

  it.skip("should re-enable submit button if submision fails", async () => {
    const { waitForFormToLoad, onSubmit } = renderComponent();
    onSubmit.mockRejectedValue({});

    const form = await waitForFormToLoad();
    await form.fill({ ...form.validData });

    expect(form.submitButton).not.toBeDisabled();
  });

  it("should reset the form after clicking the reset button", async () => {
    const { waitForFormToLoad } = renderComponent();

    const form = await waitForFormToLoad();
    await form.fill({ ...form.validData });

    expect(form.nameInput.innerHTML).toBe("");
    expect(form.priceInput.innerHTML).toBe("");
  });
});
