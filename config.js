import dotenv from 'dotenv'
dotenv.config()

const NODE_ENV = process.env.NODE_ENV || 'develop'

let config = {
  project: 'haruda-api',
  version: '0.1',
  port: 8080,
  db: {
    dialect: 'mysql',
    timezone: '+09:00',
    forceSync: false,
    alter: false
  },
  sentry: {
    DSN: ''
  },
  privateKey: 'haruda-api',
  header: {
    token: 'x-access-token'
  },
  pagination: {
    defaultPage: 1,
    defaultPageSize: 10
  },
  aws: {
    region: "ap-northeast-2",
    accesskeyId: process.env.AWS_ACCESSKEYID,
    secret: process.env.AWS_SECRET,
    s3: {
      bucket: "haruda-bucket"
    },
    mail: {
      address: 'ludative@gmail.com'
    }
  }
}

if (NODE_ENV == 'public-develop') {
}

if (NODE_ENV == 'production') {
}

export default config
