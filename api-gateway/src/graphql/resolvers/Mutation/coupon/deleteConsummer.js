import CouponsService from "#root/adapters/CodesService";

const deleteConsummerResolver = async (obj,{consummer_id}) => {

  return await CouponsService.deleteConsummer({consummer_id});

};

export default deleteConsummerResolver;

