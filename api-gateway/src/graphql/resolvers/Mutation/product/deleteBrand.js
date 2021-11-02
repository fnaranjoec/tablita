import ProductsService from "#root/adapters/ProductsService";

const deleteBrandResolver = async (obj,{brand_id}) => {

  return await ProductsService.deleteBrand({brand_id});

};

export default deleteBrandResolver;

