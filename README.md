[![FINOS - Archived](https://cdn.jsdelivr.net/gh/finos/contrib-toolbox@master/images/badge-archived.svg)](https://finosfoundation.atlassian.net/wiki/display/FINOS/Archived)

# Sprinkle: Bulk Add Users to Chatrooms for Symphony

A very simple javascript script that will help you bulk add users in your Symphony pod into chatrooms.

## Requirements

- Your own pod
- API Agent Library installed either on the cloud or on-premise
- A Service Account for the Bot that can be created in your pod's Admin Portal
- Security Certificates for Bot Authentication, with one of the certificate upload to the Admin Portal^
- Symphony REST API Documentation Access @ https://developers.symphony.com
- NodeJS/NPM installed. This is only tested to work on v6.9.1
- Email addresses of the users you want to add into chatrooms
- The chatroom ID (streamId) that you want to add users into
- A REST API client such as Postman to make API requests

^ (certificates should be obtained from your internal PKI infrastructure, or refer to Certificate Generator for Windows PDF Instructions for more information)

## Instructions

1) Run `npm install` to install all the node modules dependencies.

2) Place your .pem and .p12 certificates in the /certs folder

3) In the config.js file, fill in your own pod and agent API library endpoints (POD_URL, SESSION_ENDPOINT)

4) In the same config.js file, fill in the filepath to the appropriate certificate and certificate key as well as the certificate passphrase (CERT_FILE_PATH, CERT_KEY_FILE_PATH, CERT_PASSPHRASE)

5) You may now run `npm start`. This runs the server that can be accessed on localhost:4000

6) The script will attempt to authenticate to your pod to obtain both the pod session token.

7) Create the chatroom(s) that you want to bulk add users to if not yet done so. Obtain the streamId of the chatroom by clicking on a read receipt for a message in that chatroom.

8) Create a .txt file with the streamId of the chatroom in the first line, and the email addresses of the users you want to add to the stream in separate lines following the first line. An example is included in this repository in `bulk_add_users.txt`

9) Using a REST API client such as Postman, make a GET request to `localhost:4000/addMemberWithEmailToStream/:nameOfTxtFile` where `:nameOfTextFile` should be the name of your .txt file in Step 7. For example, `localhost:4000/addMemberWithEmailToStream/bulk_add_users`

## Credits

Sprinkle: Bulk Add Users to Chatrooms for Symphony is created by Jeff Lam Tian Hung. It can be used and modified freely, with no expectation of any support whatsoever.
