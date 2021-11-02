
const normalizeFileName = (text) => {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

export default normalizeFileName;

// module.exports = {
//     normalizeFileName
// };
