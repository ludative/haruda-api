import express from 'express'
import aws from 'aws-sdk'
import multer from 'multer'
import multerS3 from 'multer-s3'
import moment from 'moment'
import Jimp from 'jimp'
import Promise from 'bluebird'
import config from '../../../config'

const router = express.Router()

aws.config.region = config.aws.region

aws.config.update({
  accessKeyId: config.aws.accesskeyId,
  secretAccessKey: config.aws.secret
});

var s3 = new aws.S3({
  params: {
    Bucket: config.aws.s3.bucket
  }
})

const fileStorage = multerS3({
  s3: s3,
  bucket: config.aws.s3.bucket,
  acl: 'public-read',
  contentType: multerS3.AUTO_CONTENT_TYPE,
  key: (req, file, cb) => {
    var files = file.originalname.split('.')
    cb(null, `haruda/${moment().format('YYYY')}/${moment().format('MM')}/${moment().format('DD')}/${moment().format('HHmm')}/${files[0]}.${files[files.length - 1]}`)
  }
})

const s3uploadForFile = multer({
  storage: fileStorage,
  limits: {
    fileSize: 30 * 2048 * 2048
  }
})

/* router.post('/upload/image', s3uploadForImage.array('file'), (req, res, next) => {
  res.send({ link: req.files[0].location })
}) */

router.post('/upload/file', s3uploadForFile.array('file'), (req, res, next) => {
  res.send({ link: req.files[0].location })
})

// to resize before upload to s3
const storage = multer.memoryStorage()
const imageupload = multer({ storage: storage })
const THUMBNAIL_SIZE = 276 * 2
const ORIGINAL_IMAGE_SIZE = 2048

router.post('/upload/image', imageupload.array('file'), function (req, res, next) {
  if (req.files.length > 0) {
    var tokens = req.files[0].originalname.split('.')
    var extra = tokens[tokens.length - 1]
    extra = extra.toLowerCase()

    // https://github.com/oliver-moran/jimp
    Jimp.read(req.files[0].buffer, function (err, image) {
      if (err) res.status(400).send(err)

      var sizeTo = image.bitmap.width
      if (sizeTo > ORIGINAL_IMAGE_SIZE) {
        sizeTo = ORIGINAL_IMAGE_SIZE
      }

      Promise.all([
        getBufferFromJimp(image, { size: sizeTo }),
        getBufferFromJimp(image, { size: THUMBNAIL_SIZE })
      ])
        .then(function (result) {
          const originalBuffer = result[0]
          const thumbnailBuffer = result[1]

          const today = moment()
          const yyyy = today.format('YYYY')
          const mm = today.format('MM')
          const dd = today.format('DD')
          const ss = today.format('ss')

          const s3Params = {}
          s3Params.original = {
            Bucket: config.aws.s3.bucket,
            Key: 'haruda/' + yyyy + '/' + mm + '/' + dd + '/' + ss + '_' + req.files[0].originalname,
            ACL: 'public-read',
            ContentType: 'image/' + extra
          }

          s3Params.thumbnail = {
            Bucket: config.aws.s3.bucket,
            Key: 'haruda/' + yyyy + '/' + mm + '/' + dd + '/thumbnail_' + ss + '_' + req.files[0].originalname,
            ACL: 'public-read',
            ContentType: 'image/' + extra
          }

          return Promise.all([
            uploadTos3(s3Params.original, originalBuffer),
            uploadTos3(s3Params.thumbnail, thumbnailBuffer)
          ])
        })
        .then(function (result) {
          res.json({
            url: result[0].Location,
            link: result[1].Location,
            thumbnailUrl: result[1].Location
          })
        })
        .catch(function (err) {
          console.error(err)
          res.status(400).send({ message: err.message || '이미지를 업로드 하는데 실패하였습니다.' })
        })
    });
  }
})

function getBufferFromJimp(image, options) {
  return new Promise(function (resolve, reject) {
    image
      .exifRotate()
      .resize(options.size, Jimp.AUTO)
      .quality(options.quality || 100)
      .getBuffer(image.getMIME(), function (err, buffer) {
        if (err) reject(err)
        else resolve(buffer)
      })
  })
}

/**
 *
 * @param {*} params
 * @param {*} buffer
 */
function uploadTos3(params, buffer) {
  return new Promise(function (resolve, reject) {
    var s3obj = new aws.S3({ params: params })

    s3obj
      .upload({ Body: buffer })
      .send(function (err, data) {
        if (err) reject(err)
        else resolve(data)
      })
  })
}

export default router
