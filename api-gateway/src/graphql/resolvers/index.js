import * as Query from "./Query";
import * as Mutation from "./Mutation";
import UserSession from "./UserSession";
import Customer from "./Customer";
import Brand from "./Brand";
import Product from "./Product";
import Category from "./Category";
import Media from "./Media";
import CodeType from "./CodeType";
import MediaProduct from "./MediaProduct";
import CommerceType from "./CommerceType";
import Consummer from "./Consummer";
import Coupon from "./Coupon";
import CouponExtended from "./CouponExtended";

import Doctor from "./Doctor";
import Campaign from "./Campaign";
import CampaignDoctor from "./CampaignDoctor";
import CampaignProduct from "./CampaignProduct";

const resolvers = {
    Query ,
    Mutation,
    UserSession,
    Customer,
    Brand,
    Product,
    Category,
    Media,
    CodeType,
    MediaProduct,
    CommerceType,
    Consummer,
    Coupon,
    CouponExtended,
    Doctor,
    Campaign,
    CampaignDoctor,
    CampaignProduct,
};

export default resolvers;
