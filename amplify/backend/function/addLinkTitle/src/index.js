/* Amplify Params - DO NOT EDIT
	API_LINKSAPI_GRAPHQLAPIIDOUTPUT
	API_LINKSAPI_POSTTABLE_ARN
	API_LINKSAPI_POSTTABLE_NAME
	ENV
	REGION
Amplify Params - DO NOT EDIT */exports.handler = async function (event, context) {
  try {
    const metascraper = require("metascraper")([
      require("metascraper-title")(),
      require("metascraper-description")(),
      require("metascraper-image")(),
    ]);
    const AWS = require('aws-sdk')
    const got = require('got')
    //eslint-disable-line
    console.log(JSON.stringify(event, null, 2));

    for (const record of event.Records) {
      console.log('--- New Event: ' + record.eventName + ' ---')
      console.log(record)

      if (record.eventName !== 'INSERT') {
        continue
      }

      const ddbArn = record.eventSourceARN
      const ddbName = ddbArn.split(':')[5].split('/')[1]
      // Parse its properties
      const postID = record.dynamodb.NewImage.id.S
      const postUrl = record.dynamodb.NewImage.url.S
      const title = record.dynamodb.NewImage.title.S
      let scrapedTitle = title
      const { body: html, url } = await got(postUrl);
      let metadata = await metascraper({ html: html, url: url })
      scrapedTitle = metadata.title ? metadata.title : scrapedTitle
      const scrapedDesc = metadata.description
      const scrapedImgUrl = metadata.image

      // Update DynamoDB
      const docClient = new AWS.DynamoDB.DocumentClient({ region: 'us-west-2' })
      const updateExpresssion = 'SET #T=:t, #D=:d, #IU=:iu'
      const updateParams = {
        ExpressionAttributeNames: {
          "#T": "title",
          "#D": "desc",
          '#IU': 'imgUrl'
        },
        ExpressionAttributeValues: {
          ":t": scrapedTitle,
          ":d": scrapedDesc,
          ":iu": scrapedImgUrl,
        },
        Key: {
          "id": postID
        },
        ReturnValues: "ALL_NEW",
        TableName: ddbName,
        UpdateExpression: updateExpresssion
      }
      console.log('Update params: ', updateParams)
      await docClient.update(updateParams).promise()
    }
  } catch (error) {
    console.log('Update failed')
    console.error(error)
  }
  context.done(null, 'Successfully processed DynamoDB record'); // SUCCESS with message
  return
};