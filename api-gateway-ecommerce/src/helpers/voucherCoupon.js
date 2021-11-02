import voucher_codes from "voucher-code-generator";

const voucherCoupon = (length, qty) => {

    return voucher_codes.generate({
        // prefix: `${brand[0].brand_prefix.toString().trim()}`,
        // length: (MAX_CODE_CHARS - brand[0].brand_prefix.toString().trim().length),
        length: length,
        count: qty,
        charset: "abcdefghijklmnopqrstuvwxyz!$@+-*()=ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        // postfix: `${new Date.getYear()}`
    })[0];

}

export default voucherCoupon;