import express from 'express'
import request from 'request'
import parse from 'body-parser'
import UserProvision from './user-provisioning'

let app = express()
let jsonParser = parse.json()

app.post('/addMemberToStream/:streamId/:userId', UserProvision.addMemberToStream)
app.get('/getUserInfoByEmail/:email', UserProvision.getUserInfoByEmail)
app.get('/addMemberWithEmailToStream/:nameOfTxtFile', UserProvision.addMemberWithEmailToStream)

app.listen(4000, () => {
  console.log('*************************************************')
  console.log('** User Provisioning Script Server is Running **')
  console.log('** Create your .txt file with the streamId and user email addresses **')
  console.log('** and save the file to the root folder of this program. **')
  console.log('** Run a GET request to localhost:4000/addMemberWithEmailToStream/<NAME_OF_TEXT_FILE> **')
  console.log('*************************************************')
})
