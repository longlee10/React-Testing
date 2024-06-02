import OrderStatusSelector from "../components/OrderStatusSelector";
import ProductForm from "../components/ProductForm";
import BrowseProducts from "./BrowseProductsPage";

const PlaygroundPage = () => {
  return (
    <>
      <ProductForm onSubmit={() => Promise.resolve()} />
    </>
  );
};

export default PlaygroundPage;
