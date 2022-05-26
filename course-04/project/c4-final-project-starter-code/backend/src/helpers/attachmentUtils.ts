import * as AWS from 'aws-sdk'
// import * as AWSXRay from 'aws-xray-sdk'

// const XAWS = AWSXRay.captureAWS(AWS)
const XAWS = AWS

// TODO: Implement the fileStore logic

export default class FileStore {
    constructor(
        private readonly s3: AWS.S3 = new XAWS.S3({signatureVersion: 'v4'}),
        private readonly bucketName = process.env.ATTACHMENT_S3_BUCKET,
        private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION
    ) {}

    getBucketName() {
        return this.bucketName
    }

    getPresignedUrl(todoId: string): string {
        return this.s3.getSignedUrl('putObject', {
            Bucket: this.bucketName,
            Key: todoId,
            Expires: parseInt(this.urlExpiration)
        })
    }

    async storeFile(todoId: string, file: Buffer): Promise<void> {
        await this.s3.upload({
            Bucket: this.bucketName,
            Key: todoId,
            Body: file,
            ContentType: 'image/png'
        }).promise()
    }
}
