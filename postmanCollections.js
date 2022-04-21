const { v4: uuidv4 } = require('uuid');

class PostmanCollection {
  constructor(pc_template) {
    this.pc = pc_template
    this.pc.info._postman_id = uuidv4()
  }

  addTitle(title){
    this.pc.info.name = title
  }

  addDescription(description){
    this.pc.info.description = description
  }

  addItems(requests){
    this.pc.item = requests
  }

  addHost(host){
    this.pc.variable[0].value = host.split("http://")[1].split(":")[0]
    this.pc.variable[1].value = host.split("http://")[1].split(":")[1]
  }
  
  addUser(user){
    this.pc.auth.basic[0].value = user.split(":")[0]
    this.pc.auth.basic[1].value = user.split(":")[1]
  }

  addSempUser(){
  }

  addSemp(requests){
  }

  getPC() {
    return this.pc
  }

}

module.exports = PostmanCollection;
