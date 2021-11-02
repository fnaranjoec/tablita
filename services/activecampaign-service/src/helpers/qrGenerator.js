// encoder
import { Encoder, QRByte, QRKanji, ErrorCorrectionLevel } from '@nuintun/qrcode';


const qrGenerator = (code) => {
    const qrcode = new Encoder();
    // qrcode.write(`${code}`);
    qrcode.write(new QRByte(`${code}`));
    // qrcode.write(new QRKanji(`${code}`));
    qrcode.make();
    return qrcode.toDataURL();
};

// export default {generateUUID: () => uuidv4() };
export default qrGenerator;
