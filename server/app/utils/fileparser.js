const { Upload } = require("@aws-sdk/lib-storage");
const { S3Client } = require("@aws-sdk/client-s3");
const Transform = require('stream').Transform;
const AWS = require('aws-sdk');
var formidable = require("formidable");
require('dotenv').config();

const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const sessionToken = process.env.AWS_SESSION_TOKEN;
const region = process.env.AWS_REGION;
const Bucket = process.env.AWS_BUCKET_NAME;

exports.parsefile = async (req) => {
    return new Promise((resolve, reject) => {
        let options = {
            maxFileSize: 10 * 1024 * 1024, //10 MBs converted to bytes,
            allowEmptyFiles: false
        }

        var form = new formidable.IncomingForm();

        form.parse(req, (err, fields, files) => { });

        form.on('error', error => {
            console.log("error upload");
            reject(error.message)
        })

        form.on('data', data => {
            if (data.name === "successUpload") {
                console.log("success upload");
                resolve(data.value);
            }
        })

        form.on('fileBegin', (formName, file) => {
            if (file.size > options.maxFileSize) {
                reject('File size is too large. Maximum size is 10MB.');
            }

            if (!(
                file.mimetype === 'image/jpeg' ||
                file.mimetype === 'image/png' ||
                file.mimetype === 'application/pdf')
            ) {
                reject('Invalid file type. Only PDF and image files are allowed.');
            }

            file.open = async function () {
                this._writeStream = new Transform({
                    transform(chunk, encoding, callback) {
                        callback(null, chunk)
                    }
                })

                this._writeStream.on('error', e => {
                    form.emit('error', e)
                    reject(e)
                });

                // upload to S3
                new Upload({
                    client: new S3Client({
                        credentials: {
                            accessKeyId,
                            secretAccessKey
                        },
                        region
                    }),
                    params: {
                        ACL: 'public-read',
                        Bucket,
                        Key: `${Date.now().toString()}-${this.originalFilename}`,
                        Body: this._writeStream
                    },
                    tags: [], // optional tags
                    queueSize: 4, // optional concurrency configuration
                    partSize: 1024 * 1024 * 5, // optional size of each part, in bytes, at least 5MB
                    leavePartsOnError: false, // optional manually handle dropped parts
                })
                    .done()
                    .then(data => {
                        form.emit('data', { name: "complete", value: data });
                        resolve(data);
                    }).catch((err) => {
                        form.emit('error', err);
                        reject(err);
                    })
            }

            file.end = function (cb) {
                this._writeStream.on('finish', () => {
                    this.emit('end')
                    cb()
                })
                this._writeStream.end()
            }
        })
    })
}

exports.deleteImageFromS3 = async (objectLocation) => {
    const key = objectLocation.replace('https://s3.amazonaws.com/', '');
    const s3 = new AWS.S3({
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
        region: region
    });

    const params = {
        Bucket: Bucket,
        Key: key
    };

    try {
        await s3.deleteObject(params).promise();
        console.log(`Successfully deleted image with key: ${key}`);
    } catch (error) {
        console.error(`Error deleting image from S3: ${error.message}`);
        throw error;
    }
};