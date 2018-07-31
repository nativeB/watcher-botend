/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict'
const sendApi = require('./send-api');
const allusers = require('../watcher-api/users');

const handleMessage = (event) => {
  const message = event.message;
  const senderId = event.sender.id;

  if (!message.text) {
  	return;
  }

  // // Just echo back the message to the user
  // sendApi.sendMessage(senderId, {text: message.text});


  // Use NLP to change the message in case it's a greeting
    let text = message.text,query,params;
    try {
        query = getparams(text)
        console.log('query',query)
        if(!query[0]){
         query=['error']
         console.log('query1',query)}
    }
    catch(e){
        query = ['error']
        console.log('query2',query)
    }
    let response

 function getparams(str) {
     return str.match(/(("|').*?("|')|[^("|')\s]+)+(?=\s*|\s*$)/g)
    }

    //Customized responses
    console.log(query)
  switch (query[0]) {

    case '/watch':
      console.log(text,'watching')
      // getparams(text)
      // sendApi.sendMessage(senderId, { text: response });
        if(query.length  <= 4 && query.length  >= 3) {
            let params
            if (parseInt(query[2]) >= 5) {
                params = query.slice(1)
                params[1] = parseInt(`${params[1]}0000`)
                if (params[0]) {
                    if (params[0][0] === '"' && params[0][params[0].length - 1] === '"' || params[0][0] === "'" || params[0][params[0].length - 1] === '"')
                        params[0] = params[0].slice(1, params[0].length - 1)
                        console.log(params)
                        allusers.user(senderId, params)

                } else {
                    sendApi.sendMessage(senderId, {text: 'key not found'});
                }
            }else {
                sendApi.sendMessage(senderId, {text: 'interval should not be less than 5 hours'});
            }
        }
            else {
                    sendApi.sendMessage(senderId, {text: 'error in query'});
            }


      break
    case '/now':
       response = 'Received now';
       if(query.length === 2) {
           params = query.slice(1,2)[0]
           allusers.now(senderId, params)
       }
       break
    case '/list':
        allusers.list(senderId)
          break
    case '/stop':
        if(query.length === 2){
            params=query.slice(1,2)[0]
            allusers.delete_index(senderId, params)
        }
        else
            sendApi.sendMessage(senderId, { text: `${text}Please make sure the parameter is a number` });
        break
    case 'error':
       response = 'error';
       sendApi.sendMessage(senderId, { text: `error in command : ${text}` });
       break

    default:
        response = 'Got no params';
        sendApi.sendMessage(senderId, { text: response });
        break
  }
  // if (message.nlp && message.nlp.entities.greetings) {
  //   let greetings = message.nlp.entities.greetings;
  //   let isGreeting = greetings.filter((greeting) => {
  //     return greeting.confidence > 0.95;
  //   }).length > 0;
  //   if (isGreeting) {
  //     text = 'Welcome to the DevC Accra Messenger Session!';
  //   }
  // }
  // sendApi.sendMessage(senderId, {text: text});

};

module.exports = {
  handleMessage,
};