const generateCodeDoctor = ({campaign_prefix, doctor_email}) => {


    // // Genero codigo
    // campaign_doctor_code = voucher_codes.generate({
    //     length: 10,
    //     count: 1,
    //     charset: "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$#*"
    //     // postfix: `${new Date.getYear()}`
    // })[0];
    //
    // // Verifico que no se repita el codigo en el lote generado
    // while ( codes.filter(x=>x.code==campaign_doctor_code).length>0) {
    //     campaign_doctor_code = voucher_codes.generate({
    //         length: 8,
    //         count: 1,
    //         charset: "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$#*"
    //     })[0];
    // }
    //
    // // Si es unico lo guardo en el lote
    // codes.push({code: campaign_doctor_code});


    // *** QUITO ESPACIOS, CARACTERES ESPECIALES
    let code = campaign_prefix
            .replace(/\s/g, "")
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
        + '-' +
        doctor_email
            .replace(/\s/g, "")
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .toLowerCase();
    // console.log("code==>", code);

    return code;
};

// export default {generateUUID: () => uuidv4() };
export default generateCodeDoctor;




