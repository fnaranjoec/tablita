// export { default as uploads} from "./upload/uploads";
export { default as loggedInUser} from "./user/loggedInUser";

export { default as roles} from "./user/rol";

export { default as users} from "./user/user";
export { default as userSession} from "./user/userSession";


export { default as customers } from "./user/customer";
// export { default as customerById } from "./user/customer";


export { default as brands} from "./product/brand";
// export { default as brandsByCustomer} from "./product/brand";
// export { default as brandById} from "./product/brand";


export { default as products} from "./product/product";
// export { default as productsByBrand} from "./product/product";
// export { default as productById} from "./product/product";


export { default as categories} from "./media/category";
export { default as medias} from "./media/media";


// export { default as mediaById} from "./media/media";
// export { default as mediasByCategory} from "./media/media";


export { default as codeTypes} from "./code/codeTypes";


export { default as mediaProducts} from "./code/mediaProducts";
// export { default as mediaProductsByMedia} from "./code/mediaProducts";
// export { default as mediaProductsByProduct} from "./code/mediaProducts";
// export { default as mediaProductsByCodeType} from "./code/mediaProducts";


export { default as commerceTypes} from "./coupon/commerceType";
export { default as consummers} from "./coupon/consummer";
export { default as coupons} from "./coupon/coupon";
export { default as couponVerify} from "./coupon/couponVerify";


export { default as doctors } from "./doctor/doctor";
export { default as campaigns } from "./doctor/campaign";
export { default as campaignDoctors } from "./doctor/campaignDoctor";
export { default as campaignProducts } from "./doctor/campaignProduct";



// REPORTES
export { default as couponsByCategory } from "./coupon/couponsByCategory";
export { default as couponsByBrand } from "./coupon/couponsByBrand";
export { default as couponsByProduct } from "./coupon/couponsByProduct";
export { default as couponsByMedia } from "./coupon/couponsByMedia";

export { default as couponsByCampaign } from "./doctor/couponsByCampaign";
export { default as couponsByDoctor } from "./doctor/couponsByDoctor";

export { default as couponsByCategoryMetrics } from "./coupon/couponsByCategoryMetrics";
export { default as couponsByBrandMetrics } from "./coupon/couponsByBrandMetrics";
export { default as couponsByProductMetrics } from "./coupon/couponsByProductMetrics";
export { default as couponsByMediaMetrics } from "./coupon/couponsByMediaMetrics";

export { default as couponsByCampaignMetrics } from "./doctor/couponsByCampaignMetrics";
export { default as couponsByDoctorMetrics } from "./doctor/couponsByDoctorMetrics";

export { default as couponsRollUp } from "./coupon/couponsRollUp";
