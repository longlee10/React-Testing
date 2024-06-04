import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import QuantitySelector from "../../src/components/QuantitySelector";
import { CartProvider } from "../../src/providers/CartProvider";
import { Product } from "../../src/entities";

describe("Quantity Selector", () => {
  const renderComponent = () => {
    const product: Product = {
      id: 1,
      name: "Product 1",
      price: 2,
      categoryId: 1,
    };

    render(
      <CartProvider>
        <QuantitySelector product={product} />
      </CartProvider>
    );

    const user = userEvent.setup();

    const getAddToCartButton = () =>
      screen.queryByRole("button", { name: /add/i });

    const getQuantityControls = () => ({
      incrementButton: screen.queryByRole("button", { name: /\+/i }),
      decrementButton: screen.queryByRole("button", { name: /\-/i }),
      quantity: screen.queryByRole("status"),
    });

    const addToCart = async () => {
      const addToCartButton = getAddToCartButton();
      await user.click(addToCartButton!);
    };

    const incrementQuantity = async () => {
      const { incrementButton } = getQuantityControls();
      await user.click(incrementButton!);
    };

    const decrementQuantity = async () => {
      const { decrementButton } = getQuantityControls();
      await user.click(decrementButton!);
    };

    return {
      getAddToCartButton,
      getQuantityControls,
      addToCart,
      incrementQuantity,
      decrementQuantity,
    };
  };

  it("should display the add to cart button", async () => {
    const { getAddToCartButton } = renderComponent();

    expect(getAddToCartButton()).toBeInTheDocument();
  });

  it("should add product to cart", async () => {
    const { getQuantityControls, addToCart, getAddToCartButton } =
      renderComponent();

    await addToCart();

    const { incrementButton, decrementButton, quantity } =
      getQuantityControls();

    expect(incrementButton).toBeInTheDocument();
    expect(quantity).toHaveTextContent("1");
    expect(decrementButton).toBeInTheDocument();
    expect(getAddToCartButton()).not.toBeInTheDocument();
  });

  it("should increment the quantity", async () => {
    const { addToCart, getQuantityControls, incrementQuantity } =
      renderComponent();
    await addToCart();

    await incrementQuantity();
    const { quantity } = getQuantityControls();

    expect(quantity).toHaveTextContent("2");
  });

  it("should decrement the quantity", async () => {
    const {
      addToCart,
      decrementQuantity,
      incrementQuantity,
      getQuantityControls,
    } = renderComponent();
    await addToCart();
    await incrementQuantity();

    await decrementQuantity();
    const { quantity } = getQuantityControls();

    expect(quantity).toHaveTextContent("1");
  });

  it("should remove product from cart", async () => {
    const {
      addToCart,
      decrementQuantity,
      getAddToCartButton,
      getQuantityControls,
    } = renderComponent();
    await addToCart();

    await decrementQuantity();
    const { incrementButton, decrementButton, quantity } =
      getQuantityControls();

    expect(getAddToCartButton()).toBeInTheDocument();
    expect(incrementButton).not.toBeInTheDocument();
    expect(quantity).not.toBeInTheDocument();
    expect(decrementButton).not.toBeInTheDocument();
  });
});
