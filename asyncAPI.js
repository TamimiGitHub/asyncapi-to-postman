const $RefParser = require("@apidevtools/json-schema-ref-parser")
const jsf = require('json-schema-faker')

class AsyncAPI {
  constructor(ap) {
    this.ap = ap
  }

  async deref_schema(){
    return new Promise((resolve, reject) => {
      $RefParser.dereference(this.ap, (err, schema) => {
        err ? reject(err) : null
        resolve(schema)
      })
    })
  }

  // Gets the title of the Application Name
  getTitle() {
    return this.ap.info.title
  }

  getDescription() {
    return this.ap.info.description
  }
 
  // Returns the list of publish operation events objects
  // Note that Schema is the dereferenced AsyncAPI spec
  getPublishEvents(schema){
    let publishEvents = []
    Object.entries(schema.channels).forEach(([channel, details]) => {
      Object.entries(details).forEach(([operation, details]) => {
        operation.toLowerCase() == "publish" ? publishEvents.push({channel, details}) : null
      });
    });
    return publishEvents
  }

  // Generates a topic with dynamic variables
  // Either look into enums in props or
  // Consider using potman dynamic variables https://learning.postman.com/docs/writing-scripts/script-references/variables-list/
  generateTopic(channel){
  }

  // Geenrate Postman path given an event object
  // Leverage Postman types and enumarations
  // e.g /acme/rideshare/driver/funds/deposited/:version/:driver_id/:trip_id/:payment_id
  generatePath(event) {
    //  To-Do: Leverage topic enums and use generateTopic(event.channel)
    let path = []
    event.channel.split("/").map((level) => {
      path.push(level.replace('}','').replace('{',':'))
    })
    return path.join('/')
  }

  capitalize(s) {
    return s[0].toUpperCase() + s.slice(1);
  } 

  // Gets the name given event object
  getName(event) {
    let name = []
    event.channel.split("{")[0].split("/").map((word) => {
      word ? name.push(this.capitalize(word)) : null
    })
    return name.join(" ")
  }

  // Returns the body to be used in the REST request
  generateBody(event) {
    var schema = event.details.message.payload
    return JSON.stringify(jsf.generate(schema), null, 2)
  }
}

module.exports = AsyncAPI;
