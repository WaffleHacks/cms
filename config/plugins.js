module.exports = ({ env }) => ({
  email: {
    provider: 'mailgun',
    providerOptions: {
      apiKey: env('MAILGUN_API_KEY'),
      domain: env('MAILGUN_DOMAIN'),
      host: 'api.us.mailgun.net'
    },
    settings: {
      defaultFrom: `cms@${env('MAILGUN_DOMAIN')}`,
      defaultReplyTo: `no-reply@${env('MAILGUN_DOMAIN')}`
  },
  upload: {
    provider: 'aws-s3',
    providerOptions: {
      accessKeyId: env('AWS_ACCESS_KEY'),
      secretAccessKey: env('AWS_ACCESS_SECRET'),
      region: env('AWS_REGION'),
      params: {
        Bucket: env('AWS_BUCKET')
      }
    }
  }
});
