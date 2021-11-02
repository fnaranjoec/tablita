import bcrypt from "bcryptjs";

const hashPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync());
};

export default hashPassword;


