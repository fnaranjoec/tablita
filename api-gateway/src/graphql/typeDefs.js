import { gql } from 'apollo-server';
import GraphQLJSON, { GraphQLJSONObject} from "graphql-type-json";

import { file } from "./defs/file"
import { rol } from "./defs/rol"
import { user } from "./defs/user"
import { usersession } from "./defs/usersession"
import { customer } from "./defs/customer"

import { brand } from "./defs/brand"
import { product } from "./defs/product"
import { category } from "./defs/category"
import { media } from "./defs/media"
import { codeType } from "./defs/codeType"
import { mediaProduct } from "./defs/mediaProduct"
import { commerceType } from "./defs/commerceType"
import { consummer } from "./defs/consummer"
import { coupon } from "./defs/coupon"
import { couponRedime } from "./defs/couponRedime"
import { couponExtended } from "./defs/couponExtended"
import { couponMetrics } from "./defs/couponMetrics"
import { couponRollUp } from "./defs/couponRollUp"

import { doctor } from "./defs/doctor"

import { campaign } from "./defs/campaign"

import { campaignDoctor } from "./defs/campaignDoctor"

import { campaignProduct } from "./defs/campaignProduct"

import { parameter } from "./defs/parameter"

import { userFilter } from "./defs/userFilter"
import { customerFilter } from "./defs/customerFilter"
import { brandFilter } from "./defs/brandFilter"
import { productFilter } from "./defs/productFilter"
import { categoryFilter } from "./defs/categoryFilter"
import { mediaFilter } from "./defs/mediaFilter"
import { codeTypeFilter } from "./defs/codeTypeFilter"
import { mediaProductFilter } from "./defs/mediaProductFilter"
import { commerceTypeFilter } from "./defs/commerceTypeFilter"
import { consummerFilter } from "./defs/consummerFilter"
import { couponFilter } from "./defs/couponFilter"
import { couponRollUpFilter } from "./defs/couponRollUpFilter"


import { doctorFilter } from "./defs/doctorFilter"
import { campaignFilter } from "./defs/campaignFilter"
import { campaignDoctorFilter } from "./defs/campaignDoctorFilter"
import { campaignProductFilter } from "./defs/campaignProductFilter"


import { parameterFilter } from "./defs/parameterFilter"


const preTypeDefs = `

    scalar DateTime 
    scalar Object
    scalar Date
    scalar GraphQLJSON
    scalar GraphQLJSONObject
    scalar Bigint
    
  
    #--------------------------- TYPES ---------------------
    type File {
      ${file.toString()}
    }

    type Parameter {
      ${parameter.toString()}
    }
    
    
    type Rol {
      ${rol.toString()}
    }    
    
    type User {
      ${user.toString()}
    }
    
    type UserSession {
      ${usersession.toString()}
    }

    type Tokens {
      accessToken: String!
      refreshToken: String!
    }
        
    type Customer {
      ${customer.toString()}
    }
            
    type Brand {
      ${brand.toString()}
    }

    type Product {
      ${product.toString()}
    }
   
    type Category {
      ${category.toString()}
    }

    type Media {
      ${media.toString()}
    }
    
    type CodeType {
      ${codeType.toString()}
    }
    
    type MediaProduct {
      ${mediaProduct.toString()}
    }    
    
    type CommerceType {
      ${commerceType.toString()}
    }
    
    type Consummer {
      ${consummer.toString()}
    }
    
    type Coupon {
      ${coupon.toString()}
    }


    type CouponExtended {
      ${couponExtended.toString()}
    }

    type CouponMetrics {
      ${couponMetrics.toString()}
    }

    type CouponRollUp {
      ${couponRollUp.toString()}
    }


    #---------------- DOCTOR ---------------#
    
    type Doctor {
      ${doctor.toString()}
    }

    type Campaign {
      ${campaign.toString()}
    }

    type CampaignProduct {
      ${campaignProduct.toString()}
    }

    type CampaignDoctor {
      ${campaignDoctor.toString()}
    }

    #--------------------------- INPUT FILTERS ---------------------
    
    input _CustomerFilter {
      AND: [_CustomerFilter!]
      OR: [_CustomerFilter!]
      ${customerFilter.toString()}  
    }

    input _UserFilter {
      AND: [_UserFilter!]
      OR: [_UserFilter!]
      ${userFilter.toString()}
    }
    
    input _BrandFilter {
      AND: [_BrandFilter!]
      OR: [_BrandFilter!]
      ${brandFilter.toString()}
    }
    
    input _ProductFilter {
      AND: [_ProductFilter!]
      OR: [_ProductFilter!]
      ${productFilter.toString()}
    }
    
    input _CategoryFilter {
      AND: [_CategoryFilter!]
      OR: [_CategoryFilter!]
      ${categoryFilter.toString()}
    }
    
    input _MediaFilter {
      AND: [_MediaFilter!]
      OR: [_MediaFilter!]
      ${mediaFilter.toString()}
    }
    
    input _CodeTypeFilter {
      AND: [_CodeTypeFilter!]
      OR: [_CodeTypeFilter!]
      ${codeTypeFilter.toString()}
    }
    
    input _MediaProductFilter {
      AND: [_MediaProductFilter!]
      OR: [_MediaProductFilter!]
      ${mediaProductFilter.toString()}
    }
    
    input _CommerceTypeFilter {
      AND: [_CommerceTypeFilter!]
      OR: [_CommerceTypeFilter!]
      ${commerceTypeFilter.toString()}
    }
    
    input _ConsummerFilter {
      AND: [_ConsummerFilter!]
      OR: [_ConsummerFilter!]
      ${consummerFilter.toString()}
    }
    
    input _CouponFilter {
      AND: [_CouponFilter!]
      OR: [_CouponFilter!]
      ${couponFilter.toString()}
    }
        
    input _CouponRollUpFilter {
      AND: [_CouponRollUpFilter!]
      OR: [_CouponRollUpFilter!]
      ${couponRollUpFilter.toString()}
    }

    input _ParameterFilter {
      AND: [_ParameterFilter!]
      OR: [_ParameterFilter!]
      ${parameterFilter.toString()}
    }

    input _DoctorFilter {
      AND: [_DoctorFilter!]
      OR: [_DoctorFilter!]
      ${doctorFilter.toString()}  
    }

    input _CampaignFilter {
      AND: [_CampaignFilter!]
      OR: [_CampaignFilter!]
      ${campaignFilter.toString()}  
    }

    input _CampaignDoctorFilter {
      AND: [_CampaignDoctorFilter!]
      OR: [_CampaignDoctorFilter!]
      ${campaignDoctorFilter.toString()}  
    }

    input _CampaignProductFilter {
      AND: [_CampaignProductFilter!]
      OR: [_CampaignProductFilter!]
      ${campaignProductFilter.toString()}  
    }

        
    input CouponRedime {
      ${couponRedime.toString()}
    }


    #--------------------------- MUTATIONS ---------------------
    type Mutation {
    
        # ----> UPLOAD
        #singleUpload(file: Upload!): File!
        #singleUpload(file: Upload!, entity: String!, entity_id: String!): File!
        #multipleUpload(files: [Upload!]): [File!]!

        # ----> OPERATOR
        createOperator(user_name: String!, user_email: String!, user_phone: String!, user_password: String!): User!
        updateOperator(user_id: String!, user_name: String, user_email: String, user_phone: String, user_password: String, user_status: String): User!
        deleteOperator(user_id: String!) : Boolean!

        # ----> CUSTOMER
        createCustomer(user_name: String!, user_email: String!, user_phone: String!, user_password: String!, customer_name: String!, customer_address: String!, customer_picture: String!, file: Upload) : User!
        updateCustomer(customer_id: String!, customer_name: String, customer_address: String, customer_phone: String, customer_email: String, customer_picture: String, customer_status: String, file: Upload) : Customer!
        deleteCustomer(customer_id: String!) : Boolean!

        # ----> SESSION
        #createUserSession(user_email: String!,user_password: String!): UserSession!
        createUserSession(user_email: String!,user_password: String!): Tokens!
        deleteUserSession(session_id: String!): Boolean!

        # ----> BRAND
        createBrand(customer_id: String!, brand_name: String!, brand_slug: String!, brand_desc: String!, brand_prefix: String!, brand_picture: String!, file: Upload): Brand!
        updateBrand(brand_id: String!, customer_id: String, brand_name: String, brand_slug: String, brand_desc: String, brand_prefix: String, brand_picture: String, brand_status: String, file: Upload): Brand!
        deleteBrand(brand_id: String!): Boolean!
        

        # ----> PRODUCT
        createProduct(brand_id: String!, product_name: String!, product_slug: String!, product_desc: String!, product_picture: String!, product_sku: String!, file: Upload): Product!
        updateProduct(product_id: String!, brand_id: String, product_name: String, product_slug: String, product_desc: String, product_picture: String, product_status: String, product_sku: String, file: Upload): Product!
        deleteProduct(product_id: String!): Boolean!

        # ----> CATEGORY
        createCategory(category_name: String!, category_slug: String!, category_desc: String!): Category!
        updateCategory(category_id: String!, category_name: String, category_slug: String, category_desc: String, category_status: String): Category!
        deleteCategory(category_id: String!): Boolean!
        
        # ----> MEDIA
        createMedia(category_id: String!, media_name: String!, media_desc: String!, media_slug: String!, media_picture: String!, file: Upload): Media!
        updateMedia(media_id: String!, category_id: String, media_name: String, media_desc: String, media_slug: String, media_picture: String, media_status: String, file: Upload): Media!
        deleteMedia(media_id: String!): Boolean!

        # ----> CODE-TYPE
        createCodeType(code_type_name: String!): CodeType!
        updateCodeType(code_type_id: String!, code_type_name: String, code_type_status: String): CodeType!
        deleteCodeType(code_type_id: String!): Boolean!

        # ----> MEDIA-PRODUCT
        createMediaProduct(media_id: String!, product_id: String!, code_type_id: String!, media_product_desc: String!, media_product_code: String, media_product_picture: String, media_product_expire: DateTime!, media_product_descto: Float!, file: Upload): MediaProduct!
        updateMediaProduct(media_product_id: String!, media_id: String, product_id: String, code_type_id: String, media_product_desc: String, media_product_code: String, media_product_picture: String, media_product_expire: DateTime, media_product_descto: Float!, media_product_status: String, file: Upload): MediaProduct!
        deleteMediaProduct(media_product_id: String!): Boolean!

        # ----> COMMERCE-TYPE
        createCommerceType(commerce_type_name: String!): CommerceType!
        updateCommerceType(commerce_type_id: String!, commerce_type_name: String, commerce_type_status: String): CommerceType!
        deleteCommerceType(commerce_type_id: String!): Boolean!

        # ----> CONSUMMER
        createConsummer(consummer_name: String!, consummer_email: String!, consummer_identification: String!, consummer_phone: String!, consummer_city: String!, consummer_dob: DateTime!): Consummer!
        updateConsummer(consummer_id: String!, consummer_name: String, consummer_email: String, consummer_identification: String, consummer_phone: String, consummer_city: String, consummer_dob: DateTime, consummer_status: String): Consummer!
        deleteConsummer(consummer_id: String!): Boolean!


        # ----> DOCTOR
        createDoctor(doctor_name: String!, doctor_email: String!) : Doctor!
        updateDoctor(doctor_id: String!, doctor_name: String, doctor_email: String, doctor_status: String) : Doctor!
        deleteDoctor(doctor_id: String!) : Boolean!

        # ----> CAMPAIGN
        createCampaign(campaign_name: String!, campaign_slug: String!, campaign_prefix: String!, campaign_desc: String!, campaign_expire: DateTime!, campaign_picture: String!, file: Upload) : Campaign!
        updateCampaign(campaign_id: String!, campaign_name: String, campaign_slug: String, campaign_prefix: String, campaign_desc: String, campaign_expire: DateTime, campaign_status: String, campaign_picture: String, file: Upload) : Campaign!
        deleteCampaign(campaign_id: String!) : Boolean!
        copyCampaignDoctors(origin_campaign_id: String!, target_campaign_id: String!) : Boolean!
        generateCampaignDoctors(origin_campaign_id: String!) : Boolean!


        # ----> CAMPAIGN-PRODUCT
        createCampaignProduct(campaign_id: String!, product_id: String!, campaign_product_descto: Float!) : CampaignProduct!
        updateCampaignProduct(campaign_product_id: String!, campaign_id: String, product_id: String, campaign_product_descto: Float, campaign_product_status: String) : CampaignProduct!
        deleteCampaignProduct(campaign_product_id: String!) : Boolean!

        # ----> CAMPAIGN-DOCTOR
        createCampaignDoctor(campaign_id: String!, doctor_id: String!, code_type_id: String!, campaign_doctor_code: String) : CampaignDoctor!
        updateCampaignDoctor(campaign_doctor_id: String!, campaign_id: String, doctor_id: String, code_type_id: String, campaign_doctor_code: String, campaign_doctor_status: String) : CampaignDoctor!
        deleteCampaignDoctor(campaign_doctor_id: String!) : Boolean!


        # ----> COUPON
        createCoupon(media_product_code: String!, 
                     consummer_id: String!, 
                     commerce_type_id: String, 
                     consummer_name: String, 
                     consummer_email: String, 
                     consummer_identification: String, 
                     consummer_phone: String, 
                     consummer_city: String, 
                     consummer_dob: DateTime,
                     coupon_host: String, 
                     coupon_ip: String, 
                     coupon_device: String, 
                     coupon_latitude: Float, 
                     coupon_longitude: Float,
        ): Coupon!
        
        
        deleteCoupon(coupon_id: String!): Boolean!
        
        redimeCoupon(coupon_id: String!, coupon_host: String, coupon_ip: String, coupon_device: String, 
                     coupon_latitude: Float, coupon_longitude: Float, coupon_redimed_store: String!): respuestaCouponVerify!

        redimeCouponArray(coupons: [CouponRedime]!, store: String!): RespuestaJSON!
                                          
        redimeFile(file: Upload!): Respuesta!
        
        mailingCoupon(consummer_id: String!, base64: String!, brand_name: String!, porc_descto: Float!, coupon_codebar: String!): Respuesta!

        # ---------------------- BATCH FILE DOCTORS -------------------
        # doctorsFile(file: Upload!, campaign_id: String!, code_type_id: String!): Respuesta!
        doctorsFile(filePath: String!, campaign_id: String!, code_type_id: String!): Respuesta!


        # ----> COUPON DOCTOR
        createCouponDoctor(
                     campaign_doctor_code: String!, 
                     campaign_product_id: String!, 
                     consummer_id: String!, 
                     commerce_type_id: String, 
                     consummer_name: String, 
                     consummer_email: String, 
                     consummer_identification: String, 
                     consummer_phone: String, 
                     consummer_city: String, 
                     consummer_dob: DateTime,
                     coupon_host: String, 
                     coupon_ip: String, 
                     coupon_device: String, 
                     coupon_latitude: Float, 
                     coupon_longitude: Float,
        ): Coupon!
                
    }
    

    type CustomerList {
        total: Int!
        filtered: Int!
        rows: [Customer!]!
    }
    
    type BrandList {
        total: Int!
        filtered: Int!
        rows: [Brand!]!
    }
        
    type ProductList {
        total: Int!
        filtered: Int!
        rows: [Product!]!
    }
        
    type CategoryList {
        total: Int!
        filtered: Int!
        rows: [Category!]!
    }
        
    type MediaList {
        total: Int!
        filtered: Int!
        rows: [Media!]!
    }
        
    type CodeTypeList {
        total: Int!
        filtered: Int!
        rows: [CodeType!]!
    }
        
    type MediaProductList {
        total: Int!
        filtered: Int!
        rows: [MediaProduct!]!
    }
    
    type CommerceTypeList {
        total: Int!
        filtered: Int!
        rows: [CommerceType!]!
    }
    
    type ConsummerList {
        total: Int!
        filtered: Int!
        rows: [Consummer!]!
    }
    
    type CouponList {
        total: Int!
        filtered: Int!
        rows: [Coupon!]!
    }
    
    type CouponListExtended {
        total: Int!
        filtered: Int!
        rows: [CouponExtended!]!
    }
    
    type CouponMetricsList {
        total: Int!
        filtered: Int!
        rows: [CouponMetrics!]!
    }   
          
    
    type CouponRollUpList {
        total: Int!
        filtered: Int!
        rows: [CouponRollUp!]!
    }

    type ParameterList {
        total: Int!
        filtered: Int!
        rows: [Parameter!]!
    }
    
    
    type DoctorList {
        total: Int!
        filtered: Int!
        rows: [Doctor!]!
    }
    
    type CampaignList {
        total: Int!
        filtered: Int!
        rows: [Campaign!]!
    }
    
    type CampaignDoctorList {
        total: Int!
        filtered: Int!
        rows: [CampaignDoctor!]!
    }
    
    type CampaignProductList {
        total: Int!
        filtered: Int!
        rows: [CampaignProduct!]!
    }
    
    
    
        
    type Respuesta {
      success: Boolean!
      message: String!
      data: String!
    }
        
    type RespuestaCode {
      success: Boolean!
      code: Int!
      message: String!
      data: String!
    }        
    
    type RespuestaCodeJSON {
      success: Boolean!
      code: Int!
      message: String!
      data: GraphQLJSON!
    }     
    
    type RespuestaJSON {
      success: Boolean!
      message: String!
      data: GraphQLJSON!
    }        
            
    type RespuestaCodeCoupon {
      success: Boolean!
      code: Int!
      message: String!
      data: Coupon!
    }        

    type dataCouponVerify {
          id: String!
          sku: String!
          name: String!
          descto: Float!
          expiration: DateTime!
          consummer_name: String!
          consummer_identification: String!
    }
      
    type respuestaCouponVerify {
      success: Boolean!
      message: String!
      data: dataCouponVerify
    }            
    #--------------------------- QUERIES ---------------------
    type Query {
    
        loggedInUser: User!
    
        #uploads: [File!]!

        parameters(filter: _ParameterFilter): ParameterList
        parameterById(parameter_id: String!): [Parameter!]!
        parameterByName(parameter_name: String!): [Parameter!]!

        roles: [Rol!]!

        users(filter: _UserFilter): [User!]!

        userSession(me: Boolean!): UserSession
        
        customers(filter: _CustomerFilter): CustomerList
        
        brands(filter: _BrandFilter): BrandList
        brandById(brand_id: String!): [Brand]!
        brandsByCustomer(customer_id: String!): [Brand!]!
        
        products(filter: _ProductFilter): ProductList
        productById(product_id: String!): [Product!]!
        productsByBrand(brand_id: String!): [Product!]!

        categories(filter: _CategoryFilter): CategoryList
        categoryById(category_id: String!): [Category!]!
        
        medias(filter: _MediaFilter): MediaList
        mediaById(media_id: String!): [Media!]!
        mediasByCategory(category_id: String!): [Media!]!

        codeTypes(filter: _CodeTypeFilter): CodeTypeList
        codeTypeById(code_type_id: String!): [CodeType!]!

        mediaProducts(filter: _MediaProductFilter): MediaProductList
        mediaProductsByMedia(media_id: String!): [MediaProduct!]!
        mediaProductsByProduct(product_id: String!): [MediaProduct!]!
        mediaProductsByCodeType(code_type_id: String!): [MediaProduct!]!

        commerceTypes(filter: _CommerceTypeFilter): CommerceTypeList
        commerceTypeById(commerce_type_id: String!): [CommerceType!]!

        consummers(filter: _ConsummerFilter): ConsummerList
        consummerById(consummer_id: String!): [Consummer!]!

        coupons(filter: _CouponFilter): CouponListExtended
        couponById(coupon_id: String!): [Coupon!]!
        couponVerify(coupon_codebar: String!): respuestaCouponVerify!


        doctors(filter: _DoctorFilter): DoctorList
        campaigns(filter: _CampaignFilter): CampaignList
        campaignDoctors(filter: _CampaignDoctorFilter): CampaignDoctorList
        campaignProducts(filter: _CampaignProductFilter): CampaignProductList


        #--------------------------- REPORTES ---------------------
        couponsByCategory(category_id: String!): CouponListExtended
        couponsByBrand(brand_id: String!): CouponListExtended
        couponsByProduct(product_id: String!): CouponListExtended
        couponsByMedia(media_id: String!): CouponListExtended
        couponsByCampaign(campaign_id: String!): CouponListExtended
        couponsByDoctor(doctor_id: String!): CouponListExtended

        couponsByCategoryMetrics(category_id: String, from: String, to: String): CouponMetricsList
        couponsByBrandMetrics(brand_id: String, from: String, to: String): CouponMetricsList
        couponsByProductMetrics(product_id: String, from: String, to: String): CouponMetricsList
        couponsByMediaMetrics(media_id: String, from: String, to: String): CouponMetricsList

        couponsByCampaignMetrics(campaign_id: String, from: String, to: String): CouponMetricsList
        couponsByDoctorMetrics(doctor_id: String, from: String, to: String): CouponMetricsList
        
        couponsRollUp(filter: _CouponRollUpFilter): CouponRollUpList

    }
    

`;

const typeDefs = gql`${preTypeDefs}`;

export default typeDefs;


