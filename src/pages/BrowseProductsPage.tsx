import { useState } from "react";
import "react-loading-skeleton/dist/skeleton.css";
import CategorySelect from "../components/CategorySelect";
import ProductsTable from "../components/ProductsTable";

function BrowseProducts() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<
    number | undefined
  >();

  return (
    <div>
      <h1>Products</h1>
      <div className="max-w-xs">
        <CategorySelect setSelectedCategoryId={setSelectedCategoryId} />
      </div>
      <ProductsTable selectedCategoryId={selectedCategoryId} />
    </div>
  );
}

export default BrowseProducts;
