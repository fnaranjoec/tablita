import CouponsService from "#root/adapters/CouponsService";

const createConsummerResolver = async (obj,{commerce_type_name}) => {

  return await CouponsService.createConsummer({consummer_name, consummer_email, consummer_identification, consummer_phone, consummer_city, consummer_dob});

};

export default createConsummerResolver;

