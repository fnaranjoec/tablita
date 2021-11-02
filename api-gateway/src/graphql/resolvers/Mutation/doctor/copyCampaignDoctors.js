import DoctorsService from "#root/adapters/DoctorsService";
import SystemService from "#root/adapters/SystemService";
import accessEnv from "#root/helpers/accessEnv";
import voucher_codes from "voucher-code-generator";
import generateCodeDoctor from "#root/helpers/generateCodeDoctor";
import isEmpty from "lodash/isEmpty";

const copyCampaignDoctorsResolver = async (obj, args, context) => {

    // Valido el body si llega con todos los datos
    if (!args.origin_campaign_id || !args.target_campaign_id ) {
        return new Error("001|Campaign Origin or Campaign Target are missed !!!");
    }

    try {

        var FIDELIZATION_CODE = await SystemService.fetchParameterByName({parameter_name: "FIDELIZACION_CODE"});
        var INITIALIZATION_CODE = await SystemService.fetchParameterByName({parameter_name: "INICIALIZACION_CODE"});
        if (isEmpty(FIDELIZATION_CODE)) return new Error("006|Parameter FIDELIZATION_CODE NOT EXIST.");
        if (isEmpty(INITIALIZATION_CODE)) return new Error("007|Parameter INITIALIZATION_CODE NOT EXIST.");


        const campaignOrigin= await DoctorsService.fetchCampaignById({campaign_id: args.origin_campaign_id});
        // console.log("campaign==>", campaign);
        if (isEmpty(campaignOrigin))  return new Error(`002|Campaign Origin Id is invalid, deleted or not exist.`);

        const campaignTarget= await DoctorsService.fetchCampaignById({campaign_id: args.target_campaign_id});
        // console.log("campaign==>", campaign);
        if (isEmpty(campaignTarget))  return new Error(`002|Campaign Target Id is invalid, deleted or not exist.`);


        const campaignOriginOnTarget= await DoctorsService.fetchDoctorsByCampaign({campaign_id: args.target_campaign_id});
        // console.log("campaignOriginOnTarget==>", campaignOriginOnTarget);
        if (!isEmpty(campaignOriginOnTarget))  return new Error(`002|Campaign Target exists or was copied previously. Can't be copied!`);


        // Obtengo los doctores de la campaña original
        const campaignDoctorOrigin= await DoctorsService.fetchDoctorsByCampaign({campaign_id: args.origin_campaign_id});
        // console.log("campaign==>", campaign);
        if (isEmpty(campaignDoctorOrigin))  return new Error(`002|Campaign Origin has no doctors.`);

        // const campaign = await DoctorsService.fetchCampaignById({campaign_id: args.origin_campaign_id});
        for (let doctor of campaignDoctorOrigin){
            let doctorRow = await DoctorsService.fetchDoctorById({doctor_id: doctor.doctor_id});
            let campaignRow = await DoctorsService.fetchCampaignById({campaign_id: doctor.campaign_id});

            let fullName=doctor.doctor_name.toString().trimStart().trimEnd();
            fullName=fullName.indexOf(" ")<0 ? fullName.replace(/\s/g, "").toLowerCase() : fullName.substring(0,fullName.indexOf(" ")).replace(/\s/g, "").toLowerCase();

            // let fName= doctorRow.nombre.indexOf(" ")<0 ? doctorRow.nombre.replace(/\s/g, "").toLowerCase() : doctorRow.nombre.substring(0,doctorRow.nombre.indexOf(" ")).replace(/\s/g, "").toLowerCase();
            // let lName= doctorRow.apellido.replace(/\s/g, "").toLowerCase();

            let fName= fullName.split(',')[0];
            let lName= fullName.split(',')[1];

            await DoctorsService.createCampaignDoctor({args: {
                campaign_id: args.target_campaign_id,
                doctor_id: doctor.doctor_id,
                code_type_id: FIDELIZATION_CODE.parameter_text,
                campaign_doctor_code: `dr@${fName}${lName}_${campaign.campaign_prefix}`,
                // campaign_doctor_code: generateCodeDoctor({campaign_prefix: campaignRow.campaign_prefix, doctor_email: doctorRow.doctor_email}),
            }});

            // console.log("doctor==>", doctor);
            // console.log("--------------------------------------------");


        }


        return true;

    } catch (e) {
        console.log("e==>", e);
        return false;


    }



};

export default copyCampaignDoctorsResolver;

