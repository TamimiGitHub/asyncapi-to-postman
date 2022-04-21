#!/usr/bin/env node

const fs = require('fs');
const commander = require('commander');
const path = require('path');
const AsyncAPI = require('./asyncAPI');
const PostmanCollection = require("./postmanCollections")

function main() {
  // Parse command line args
  commander
    .name('async-to-postman -f <asyncAPIFile> ')
    .description('This CLI takes in an asyncapi spec file and creates a postman collections to send POST requests on the Solace PubSub+ REST port')
    .version('1.0.0', '-v, --version')
    .usage('[OPTIONS]...')
    .requiredOption('-f, --file <value>', 'Required: AsyncAPI spec file')
    .option('-h, --host  <host>:<port>', 'Solace PubSub+ Broker host:port','http://localhost:9000')
    .option('-u, --user <username>:<password>', 'Solace PubSub+ Broker username:password.', 'default:default')
    .option('-s, --semp <username>:<password>', 'Solace PubSub+ Broker SEMP admin:admin.')
    .option('-o, --output <file/location/name.json>', 'Output file name. By default: <asyncAPIFileName_collections>')
    .parse(process.argv);
  
  const options = commander.opts()
  
  // Todo: validate if -f file exists
  // const sempUser = options.semp ? options.semp.split(":")[0] : undefined
  // const sempPass = options.semp ? options.semp.split(":")[1] : undefined
  
  var outputFile = options.output ? options.output : path.basename(options.file, path.extname(options.file)).replace(/\s/g, "") + "_Collections.json"
  
  var asyncAPIFile = JSON.parse(fs.readFileSync(options.file))
  const ap = new AsyncAPI(asyncAPIFile)
  var pc = new PostmanCollection(require("./EDACollections-template.json"))
  
  requests = []
  // Dereference all $refs in file
  ap.deref_schema().then((schema) => {
    ap.getPublishEvents(schema).map(event => {
      var path = ap.generatePath(event)
      // Fill in the requests in the postman collection definition file
      item = {
        "name": ap.getName(event),
        "request": {
          "method": "POST",
          "header": [],
          "url": {
            "raw": `{{SolaceHost}}:{{SolacePort}}/${path}`,
            "protocol": "http",
            "host": [
              "{{SolaceHost}}"
            ],
            "port": "{{SolacePort}}",
            "path": path.split("/"),
          },
           "body": {
            "mode": "raw",
            "raw": ap.generateBody(event)
          }
        },
        "response": []
      }
      requests.push(item)
    })
  
    // if (sempUser && sempPass) {
    //   requests.push(addSempCalls())
    // }
    
    // Fill in PC
    pc.addTitle(ap.getTitle())
    pc.addDescription(ap.getDescription())
    pc.addItems(requests)
    pc.addHost(options.host)
    pc.addUser(options.user)
    // Write out the collections file
    fs.writeFile(outputFile, JSON.stringify(pc.getPC(),null, 2), err => {})
    console.log(`Postman collection created and found in ${outputFile}`)
  
  }).catch((error) => {
    this.log(error)
  })
  
  // function addSempCalls() {
  //   return [
  //       {
  //       "name": ap.getName(event),
  //       "request": {
  //         "method": "POST",
  //         "header": [],
  //         "url": {
  //           "raw": `{{SolaceHost}}:{{SolacePort}}/${topic}`,
  //           "protocol": "http",
  //           "host": [
  //             "{{SolaceHost}}"
  //           ],
  //           "port": "{{SolacePort}}",
  //           "path": topic.split("/"),
  //         },
  //         "body": {
  //           "mode": "raw",
  //           "raw": ap.getBody(event)
  //         }
  //       },
  //       "response": []
  //     },
  //     {
  //       "name": ap.getName(event),
  //       "request": {
  //         "method": "POST",
  //         "header": [],
  //         "url": {
  //           "raw": `{{SolaceHost}}:{{SolacePort}}/${topic}`,
  //           "protocol": "http",
  //           "host": [
  //             "{{SolaceHost}}"
  //           ],
  //           "port": "{{SolacePort}}",
  //           "path": topic.split("/"),
  //         },
  //         "body": {
  //           "mode": "raw",
  //           "raw": ap.getBody(event)
  //         }
  //       },
  //       "response": []
  //     }
  //   ]
  // }
}

if (require.main === module) {
  main();
}