// import MediasService from "#root/adapters/MediasService";
import storeUpload from "#root/helpers/storeUpload";

const singleUploadResolver = async (obj, {file, upload_dir}) => {

    await storeUpload({file, upload_dir})
    .then(res => {
        return true;
    })
    .catch(err => {
        return false;
    });

};

export default singleUploadResolver;
