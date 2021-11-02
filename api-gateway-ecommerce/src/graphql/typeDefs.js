import { gql } from 'apollo-server';

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
import { parameterFilter } from "./defs/parameterFilter"

// console.log('customerFilter==> ', customerFilter);

const preTypeDefs = `

    scalar DateTime 
    scalar GraphQLJSON
    scalar GraphQLJSONObject
  
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
    
    input _ParameterFilter {
      AND: [_ParameterFilter!]
      OR: [_ParameterFilter!]
      ${parameterFilter.toString()}
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
        #createOperator(user_name: String!, user_email: String!, user_phone: String!, user_password: String!): User!
        #updateOperator(user_id: String!, user_name: String, user_email: String, user_phone: String, user_password: String, user_status: String): User!
        #deleteOperator(user_id: String!) : Boolean!

        # ----> CUSTOMER
        #createCustomer(user_name: String!, user_email: String!, user_phone: String!, user_password: String!, customer_name: String!, customer_address: String!, customer_picture: String!, file: Upload) : User!
        #updateCustomer(customer_id: String!, customer_name: String, customer_address: String, customer_phone: String, customer_email: String, customer_picture: String, customer_status: String, file: Upload) : Customer!
        #deleteCustomer(customer_id: String!) : Boolean!

        # ----> SESSION
        #createUserSession(user_email: String!,user_password: String!): UserSession!
        #createUserSession(user_email: String!,user_password: String!): Tokens!
        #deleteUserSession(session_id: String!): Boolean!

        # ----> BRAND
        #createBrand(customer_id: String!, brand_name: String!, brand_slug: String!, brand_desc: String!, brand_prefix: String!, brand_picture: String!, file: Upload): Brand!
        ##updateBrand(brand_id: String!, customer_id: String!, brand_name: String!, brand_slug: String!, brand_desc: String!, brand_prefix: String!, brand_picture: String!, brand_status: String!, file: Upload): Brand!
        #updateBrand(brand_id: String!, customer_id: String, brand_name: String, brand_slug: String, brand_desc: String, brand_prefix: String, brand_picture: String, brand_status: String, file: Upload): Brand!
        #deleteBrand(brand_id: String!): Boolean!
        

        # ----> PRODUCT
        #createProduct(brand_id: String!, product_name: String!, product_slug: String!, product_desc: String!, product_picture: String!, product_sku: String!, file: Upload): Product!
        #updateProduct(product_id: String!, brand_id: String, product_name: String, product_slug: String, product_desc: String, product_picture: String, product_status: String, product_sku: String, file: Upload): Product!
        #deleteProduct(product_id: String!): Boolean!

        # ----> CATEGORY
        #createCategory(category_name: String!, category_slug: String!, category_desc: String!): Category!
        #updateCategory(category_id: String!, category_name: String, category_slug: String, category_desc: String, category_status: String): Category!
        #deleteCategory(category_id: String!): Boolean!
        
        # ----> MEDIA
        #createMedia(category_id: String!, media_name: String!, media_desc: String!, media_slug: String!, media_picture: String!, file: Upload): Media!
        #updateMedia(media_id: String!, category_id: String, media_name: String, media_desc: String, media_slug: String, media_picture: String, media_status: String, file: Upload): Media!
        #deleteMedia(media_id: String!): Boolean!

        # ----> CODE-TYPE
        #createCodeType(code_type_name: String!): CodeType!
        #updateCodeType(code_type_id: String!, code_type_name: String, code_type_status: String): CodeType!
        #deleteCodeType(code_type_id: String!): Boolean!

        # ----> MEDIA-PRODUCT
        #createMediaProduct(media_id: String!, product_id: String!, code_type_id: String!, media_product_desc: String!, media_product_code: String, media_product_picture: String, media_product_expire: DateTime!, media_product_descto: Float!, file: Upload): MediaProduct!
        #updateMediaProduct(media_product_id: String!, media_id: String, product_id: String, code_type_id: String, media_product_desc: String, media_product_code: String, media_product_picture: String, media_product_expire: DateTime, media_product_descto: Float!, media_product_status: String, file: Upload): MediaProduct!
        #deleteMediaProduct(media_product_id: String!): Boolean!

        # ----> COMMERCE-TYPE
        #createCommerceType(commerce_type_name: String!): CommerceType!
        #updateCommerceType(commerce_type_id: String!, commerce_type_name: String, commerce_type_status: String): CommerceType!
        #deleteCommerceType(commerce_type_id: String!): Boolean!

        # ----> CONSUMMER
        #createConsummer(consummer_name: String!, consummer_email: String!, consummer_identification: String!, consummer_phone: String!, consummer_city: String!, consummer_dob: DateTime!): Consummer!
        #updateConsummer(consummer_id: String!, consummer_name: String, consummer_email: String, consummer_identification: String, consummer_phone: String, consummer_city: String, consummer_dob: DateTime, consummer_status: String): Consummer!
        #deleteConsummer(consummer_id: String!): Boolean!

        # ----> COUPON
        #createCoupon(media_product_code: String!, consummer_id: String!, commerce_type_id: String, 
        #             consummer_name: String, consummer_email: String, consummer_identification: String, 
        #             consummer_phone: String, consummer_city: String, consummer_dob: DateTime,
        #             coupon_host: String, coupon_ip: String, coupon_device: String, 
        #             coupon_latitude: Float, coupon_longitude: Float
        #): Coupon!
        
        #deleteCoupon(coupon_id: String!): Boolean!
        
        redimeCoupon(coupon_id: String!, coupon_host: String, coupon_ip: String, coupon_device: String, 
                     coupon_latitude: Float, coupon_longitude: Float, coupon_redimed_store: String!): respuestaCouponVerify!
                     
        redimeCouponArray(coupons: [CouponRedime]!, store: String!): RespuestaJSON!
                     
        #redimeFile(file: Upload!): Respuesta!
        
        #mailingCoupon(consummer_id: String!, base64: String!): Respuesta!

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
    
    type ParameterList {
        total: Int!
        filtered: Int!
        rows: [Parameter!]!
    }
    
        
    type Respuesta {
      success: Boolean!
      message: String!
      data: String!
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
     
        
    type RespuestaJSON {
      success: Boolean!
      message: String!
      data: GraphQLJSON!
    }
    
      
    type respuestaCouponVerify {
      success: Boolean!
      message: String!
      data: dataCouponVerify!
    }
        
            
    #--------------------------- QUERIES ---------------------
    type Query {
    
        #loggedInUser: User!
    
        ##uploads: [File!]!

        #parameters(filter: _ParameterFilter): ParameterList
        #parameterById(parameter_id: String!): [Parameter!]!
        #parameterByName(parameter_name: String!): [Parameter!]!

        #roles: [Rol!]!

        #users(filter: _UserFilter): [User!]!

        #userSession(me: Boolean!): UserSession
        
        #customers(filter: _CustomerFilter): CustomerList
        
        #brands(filter: _BrandFilter): BrandList
        #brandById(brand_id: String!): [Brand]!
        #brandsByCustomer(customer_id: String!): [Brand!]!
        
        #products(filter: _ProductFilter): ProductList
        #productById(product_id: String!): [Product!]!
        #productsByBrand(brand_id: String!): [Product!]!

        #categories(filter: _CategoryFilter): CategoryList
        #categoryById(category_id: String!): [Category!]!
        
        #medias(filter: _MediaFilter): MediaList
        #mediaById(media_id: String!): [Media!]!
        #mediasByCategory(category_id: String!): [Media!]!

        #codeTypes(filter: _CodeTypeFilter): CodeTypeList
        #codeTypeById(code_type_id: String!): [CodeType!]!

        #mediaProducts(filter: _MediaProductFilter): MediaProductList
        #mediaProductsByMedia(media_id: String!): [MediaProduct!]!
        #mediaProductsByProduct(product_id: String!): [MediaProduct!]!
        #mediaProductsByCodeType(code_type_id: String!): [MediaProduct!]!

        #commerceTypes(filter: _CommerceTypeFilter): CommerceTypeList
        #commerceTypeById(commerce_type_id: String!): [CommerceType!]!

        #consummers(filter: _ConsummerFilter): ConsummerList
        #consummerById(consummer_id: String!): [Consummer!]!

        #coupons(filter: _CouponFilter): CouponList
        #couponById(coupon_id: String!): [Coupon!]!
        
        couponVerify(coupon_codebar: String!): respuestaCouponVerify!


    }


    

`;

const typeDefs = gql`${preTypeDefs}`;

export default typeDefs;


