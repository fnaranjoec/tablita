// import { v4 as uuidv4 } from 'uuid';
// import { uuid } from 'uuidv4';
import { v4 as uuidv4 } from 'uuid';

const generateUUID = () => {
    return uuidv4();
};

// export default {generateUUID: () => uuidv4() };
export default generateUUID;

