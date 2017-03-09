import fs from 'fs'
import request from 'request'
import config from './config'

let authRequest, authRequestWithTokens

authRequest = request.defaults({
  cert: fs.readFileSync(config.CERT_FILE_PATH),
  passphrase: config.CERT_PASSPHRASE
})

let setAuthRequestHeaders = () => {
  authRequestWithTokens = request.defaults({
    cert: fs.readFileSync(config.CERT_FILE_PATH),
    passphrase: config.CERT_PASSPHRASE
    headers: {
      sessionToken: config.SESSION_TOKEN,
      'content-type': 'application/json'
    }
  })
}

let authenticate = () => {
  console.log('Get Session Token Start')
  authRequest.post({ url: config.SESSION_ENDPOINT }, (err, resp, body) => {
    console.log('Get Session Token')
    console.log(JSON.parse(body))
    config.SESSION_TOKEN = JSON.parse(body).token
  })
}

let getUserId = () => {
  authRequestWithTokens.get({ url: config.POD_URL + '/sessioninfo' }, (err, resp, body) => {
    console.log('Get User Id')
    console.log(body)
    if (JSON.parse(body).code === 401) {
      getUserId()
    }
    else {
      config.BOT_ID = JSON.parse(body).userId
    }
  })
}

let heartBeat = () => {
  authRequestWithTokens.get({ url: config.POD_URL + '/sessioninfo' }, (err, resp, body) => {
    console.log('Heart Beat')
    console.log(body)
    if (JSON.parse(body).code === 401) {
      console.log('Re-authenticate to get sessionToken and kmToken')
      authenticate()
      setAuthRequestHeaders()
      getUserId()
    }
    else {
      config.BOT_ID = JSON.parse(body).userId
    }
  })
}

authenticate()
setAuthRequestHeaders()
heartBeat()

setInterval(() => {
  heartBeat()
}, 60000*15)



let Api = {
  getUserInfoByEmail (req, res) {
    let userEmail = req.params.email

    authRequestWithTokens.get({ url: config.POD_URL + '/user?email=' + userEmail }, (err, resp, body) => {
      res.send(body)
    })
  },

  addMemberToStream (req, res) {
    let streamId = req.params.streamId
    let userId = req.params.userId

    authRequestWithTokens.post({
      url: config.POD_URL + '/room/' + streamId  + '/membership/add',
      body: {
        id: userId
      },
      json: true
    }, (err, resp, body) => {
      res.send(body)
    })
  },

  addMemberWithEmailToStream (req, res) {
    let nameOfTxtFile = req.params.nameOfTxtFile
    let roomId
    let userId

    fs.readFile('./' + nameOfTxtFile + '.txt', 'utf8', (err, data) => {
      data = data.split('\n')
      roomId = data[0]

      let regExp = new RegExp('/', 'g')
      roomId = roomId.replace(regExp, '_')

      let regExp2 = new RegExp('[+]', 'g')
      roomId = roomId.replace(regExp2, '-')

      let regExp3 = new RegExp('=', 'g')
      roomId = roomId.replace(regExp3, '')

      for (let i = 1; i < data.length + 1; i++) {
        authRequestWithTokens.get({ url: config.POD_URL + '/user?email=' + data[i] }, (err, resp, body) => {
          if (body) {
            userId = JSON.parse(body).id

            authRequestWithTokens.post({
              url: config.POD_URL + '/room/' + roomId  + '/membership/add',
              body: {
                id: userId
              },
              json: true
            }, (err, resp, body) => {
              console.log(body)
            })
          }
        })
      }

      res.send('Script run success... check room to ensure all members added correctly.')
    })

  }
}

export default Api