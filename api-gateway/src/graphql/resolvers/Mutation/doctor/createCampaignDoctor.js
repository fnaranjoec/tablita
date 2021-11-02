import DoctorsService from "#root/adapters/DoctorsService";
import accessEnv from "#root/helpers/accessEnv";
import voucher_codes from "voucher-code-generator";
import generateCodeDoctor from "#root/helpers/generateCodeDoctor";
import isEmpty from "lodash/isEmpty";

const createCampaignDoctorResolver = async (obj, args, context) => {

    // Valido el body si llega con todos los datos
    if (!args.campaign_id || !args.doctor_id || !args.code_type_id ) {
        return new Error("001|Campaign Doctor data are incomplete !!!");
    }

    const doctor= await DoctorsService.fetchDoctorById({doctor_id: args.doctor_id});
    // console.log("campaign==>", campaign);

    if (isEmpty(doctor))  return new Error(`002|Doctor Id is invalid, deleted or not exist.`);


    const campaign= await DoctorsService.fetchCampaignById({campaign_id: args.campaign_id});

    // Si no hay codigo lo genero
    if (!args.campaign_doctor_code) {

        let fName= doctor.nombre.indexOf(" ")<0 ? doctor.nombre.replace(/\s/g, "").toLowerCase() : doctor.nombre.substring(0,doctor.nombre.indexOf(" ")).replace(/\s/g, "").toLowerCase();
        let lName= doctor.apellido.replace(/\s/g, "").toLowerCase();

        args['campaign_doctor_code']=`dr@${fName}${lName}`;
        // args['campaign_doctor_code']=generateCodeDoctor({campaign_prefix: campaign.campaign_prefix, doctor_email: doctor.doctor_email});
    }

    return await DoctorsService.createCampaignDoctor({args});
};

export default createCampaignDoctorResolver;

