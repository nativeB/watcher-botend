const axios = require('axios')

const watching =(query) => {
       return axios.post('https://watcher-aidahbot.herokuapp.com/interest-over-time', {"interest": query,"startTime":new Date(Date.now())})
            .then(response => {
                return response.data
            })
            .catch(error => {
                return error
            })
}

module.exports = {
    watching,
}
// // module.exports = {
// //     watching
// };