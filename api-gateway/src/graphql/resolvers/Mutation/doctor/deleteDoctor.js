import DoctorsService from "#root/adapters/DoctorsService";

const deleteDoctorResolver = async (obj, args, context) => {

  if (!args.doctor_id) {
      return new Error("Doctor ID is missing!");
  }

  return await DoctorsService.deleteDoctor({args});

};

export default deleteDoctorResolver;

