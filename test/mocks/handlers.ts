import { http, HttpResponse } from "msw";
import { db } from "./db";

export const handlers = [
  // http.get("/products", () => {
  //   return HttpResponse.json(products);
  // }),

  // http.get("/products/:id", ({ params }) => {
  //   const id = parseInt(params.id as string);

  //   const product = products.find((p) => p.id === id);
  //   if (!product) return new HttpResponse(null, { status: 404 });

  //   return HttpResponse.json(product);
  // }),

  ...db.product.toHandlers("rest"),
  ...db.categories.toHandlers("rest"),
];
