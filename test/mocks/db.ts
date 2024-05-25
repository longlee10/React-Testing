import { primaryKey, factory, oneOf, manyOf } from "@mswjs/data";
import { faker } from "@faker-js/faker";

export const db = factory({
  product: {
    id: primaryKey(faker.number.int),
    name: faker.commerce.productName,
    price: () => faker.number.int({ min: 1, max: 100 }),
    categoryId: faker.number.int,
    category: oneOf("categories"),
  },
  categories: {
    id: primaryKey(faker.number.int),
    name: faker.commerce.department,
    products: manyOf("product"),
  },
});

export const getProductByCategory = (categoryId: number) =>
  db.product.findMany({
    where: { categoryId: { equals: categoryId } },
  });
