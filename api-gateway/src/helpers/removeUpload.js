import aws4 from "aws4";
import config from "./config";
import * as fs from "fs";
import * as https from "https";
import pump from "pump";
import crypto from "crypto-js";
import accessEnv from "#root/helpers/accessEnv";

// import generateUUID from "./generateUUID";

const S3_BUCKET_PATH = accessEnv("S3_BUCKET_PATH", '/coupons');

const getSignatureKey = (key, dateStamp, regionName, serviceName) => {
    var kDate = crypto.HmacSHA256(dateStamp, "AWS4" + key);
    var kRegion = crypto.HmacSHA256(regionName, kDate);
    var kService = crypto.HmacSHA256(serviceName, kRegion);
    var kSigning = crypto.HmacSHA256("aws4_request", kService);
    return kSigning;
}


const deleteObject = async path => {

    const signature= await getSignatureKey(config.secretAccessKey, new Date(), config.region, 's3');

    const hash = aws4.sign(
        {
            service: 's3',
            region: config.region,
            method: 'DELETE',
            acl: 'public',
            visibility: 'public',
            path: path,
            host: config.endpoint,
            headers: {
                // 'Content-Type': 'application/octet-stream',
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
                'x-amz-acl': 'public-read',
                'x-amz-request-id': `${request_id}`',
                'Authorization': `AWS4-HMAC-SHA256 Credential=${config.accessKeyId}/${new Date()}/${config.region}/s3/aws4_request,SignedHeaders=host;x-amz-acl;x-amz-content-sha256;x-amz-date;x-amz-acl;x-amz-request-id,Signature=${signature} `,
            }
        },
        config
    )

    return https.request({
        hostname: config.endpoint,
        port: 443,
        method: 'DELETE',
        path: path,
        headers: hash.headers
    })
}


const removeUpload = async ({file}, prefix_files) => {

    const { createReadStream, filename, mimetype} = await file;
    // const id = generateUUID();
    // const path = `${UPLOAD_DIR}/${id}-${filename}`;
    // const path = `${upload_dir}/${id_file}-${filename}`;


    //Reemplazo estacios del nombre de archivo
    var pureFilename= await filename.replace(/\s/g, '-');
    console.log('pureFilename ==> ', pureFilename);

    // *** S3 BUCKET
    const prefixedFileName = [prefix_files, pureFilename].join('-');
    const bucketFile = [S3_BUCKET_PATH, (prefixedFileName)].join('/');
    // const path = `${upload_dir}/${filename}`;
    const path = `${config.endpoint}${bucketFile}`;
    const uploaded = { pureFilename, mimetype, path };

    const stream = createReadStream();

    const ws = await deleteObject(bucketFile, )
    pump(stream, ws, () => console.log('Object deleted !'))



    // *** FILESYSTEM
    // // Store the file in the FILESYSTEM.
    // await new Promise((resolve, reject) => {
    //     // Create a stream to which the upload will be written.
    //     const writeStream = fs.createWriteStream(`${path}`);
    //
    //     // When the upload is fully written, resolve the promise.
    //     writeStream.on('finish', resolve);
    //
    //     // If there's an error writing the file, remove the partially written file
    //     // and reject the promise.
    //     writeStream.on('error', (error) => {
    //         fs.unlink(path, () => {
    //             reject(error);
    //         });
    //     });
    //
    //     // In node <= 13, errors are not automatically propagated between piped
    //     // streams. If there is an error receiving the upload, destroy the write
    //     // stream with the corresponding error.
    //     stream.on('error', (error) => writeStream.destroy(error));
    //
    //     // Pipe the upload into the write stream.
    //     stream.pipe(writeStream);
    // });

    // // Record the file metadata in the DB.
    // db.get('uploads').push(file).write();

    return uploaded;
    // return path;

};



export default storeUpload;
