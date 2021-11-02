import ProductsService from "#root/adapters/ProductsService";

const deleteProductResolver = async (obj,{product_id}) => {

  return await ProductsService.deleteProduct({product_id});

};

export default deleteProductResolver;

