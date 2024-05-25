import { it, expect, describe } from "vitest";
import { faker } from "@faker-js/faker";
import { db } from "./mocks/db";

describe("group", () => {
  it("should", async () => {
    [1, 2, 3].forEach(() => db.categories.create());
    console.log(db.categories.getAll());
  });
});
