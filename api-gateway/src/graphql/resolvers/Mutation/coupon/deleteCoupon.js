import CouponsService from "../../../../adapters/CouponsService";

const deleteCouponResolver = async (obj,{coupon_id}) => {

  return await CouponsService.deleteCoupon({coupon_id});

};

export default deleteCouponResolver;

