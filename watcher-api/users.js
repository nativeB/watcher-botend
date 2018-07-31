let watch = require('./watcher')
const sendApi = require('../messenger/send-api');
let allusers = {}
class users {
    constructor(fb_id, query) {
        this.fb_id = fb_id;
        this.query=[query.title];
        this.query_params={}
        this.query_params[query.title]=query.data
        // this.result = {}
        // console.log('new user: ', this.query)
    }
    set_new_query(query){
        this.query.push(query.title)
        this.query_params[query.title] = query.data
        this.test(query.title)
    }
    listall(){
        this.notify(
                this.query.map((x,idx) => {
                    console.log('is running ',idx,x)
                    return  `${idx}: ${x} => ${this.query_params[x].interval} `
                }).toString().replace(/,/g,',\n')
        )
    }
    delete(title){
        // this.query[title].status=false
        console.log(this.query,title,'checking')
        if(this.query.includes(title)) {
            this.query.splice(this.query.indexOf(title),1)
        }else  this.notify(
            ` ${title}: dosen't exist `
        );
    }
    notify(tell){
        sendApi.sendMessage(this.fb_id,{ text:tell})
    }
    test(title) {
        console.log(title)
        if(this.query.includes(title))
            watch.watching(title)
                .then(response => {
                    if(response.data.hasData) {
                        console.log('response',response)
                        if(this.query_params[title].threshold === null)
                            this.notify(
                                `request: [${title}: ${response.data.formattedValue[0]} ]`
                            );
                        else if(response.data.formattedValue[0] >=this.query_params[title].threshold) {
                            this.notify(
                                `threshhold met for ${title}: \n{\nrequests: ${response.data.formattedValue[0]}\nthreshhold: ${this.query[title].threshold}\n}`
                            );

                        }
                    }
                    // if(title!==0 && this.query[title].status===false)
                    // sendApi.sendMessage(this.fb_id, {text: query+' '+this.query[title].query});
                    if(this.query_params[title].status)
                        setTimeout(() => {
                            this.test(title)
                        },this.query_params[title].interval)
                }).catch( error =>{
                console.log(error)
            })
        else {
            delete this.query_params[title]
            this.notify(`${title} is stopped`)
        }
        // console.log('running for :' ,allusers[this.fb_id])

    }

}
//1 query 2 interval token
const user =(fb_id,query) => {
    let payload = {
        title:query[0],
        data:{
             interval:query[1],
             threshold:query.length ===3 ? query[2] : null,
             status:true
        }
    }
    console.log('got payload',payload)
    if(allusers[fb_id]) {
        allusers[fb_id].set_new_query(payload)
        // allusers[fb_id].test(interval)
    }
    else {
        // console.log('got',interval,query)
        allusers[fb_id] = new users(fb_id,payload)
        console.log(payload.title)
        allusers[fb_id].test(payload.title)
        // allusers[fb_id].test(interval)
    }
}
const now =(fb_id,query) => {
    watch.watching(query[0])
        .then(response =>{
            sendApi.sendMessage(fb_id,{
                text:`request: ${query}: ${response.data.formattedValue[0]}`})
        })
        .catch( e =>{

        })
}
const list =(fb_id) => {
    allusers[fb_id].listall()
}
const delete_index =(fb_id,param) => {
    allusers[fb_id].delete(param)
}


//creating an instance
// module.exports={
//     user
// }

module.exports = {
    user,
    now,
    list,
    delete_index
};