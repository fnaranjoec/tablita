// import ProductsService from "#root/adapters/ProductsService";
import CouponsService from "#root/adapters/CouponsService";
import accessEnv from "#root/helpers/accessEnv";

//{media_product_id, media_id, product_id, code_type_id, media_product_desc, media_product_code, media_product_picture, media_product_expire, media_product_status, file=null}
const updateCouponResolver = async (obj, args, context ) => {

    if (!args.coupon_id) {
        return new Error("Coupon ID is missing!");
    }


    // // Generar CODE 39 PARA EL CUPON NUEVAMENTE
    // const product= await ProductsService.fetchProductById({product_id: args.product_id});
    // const brand= await ProductsService.fetchBrandById({brand_id: product[0].brand_id});


    // // verifico si viene CODE en los argumentos y si esta vacio
    // if (args.coupon_codebar) {
    //     if (args.coupon_codebar=="") {
    //         args.coupon_codebar= brand[0].brand_slug.toString().trim() + product[0].product_slug.toString().trim();
    //     }
    // }

    return await CouponsService.updateCoupon({args});


};

export default updateCouponResolver;

