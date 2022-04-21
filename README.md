# AsyncAPI to Postman Collections

This utility takes in any JSON formatted AsyncAPI file as an input parameter and outputs a Postman collections file that can then be imported to Postman. Note that the events are converted to POST requests sent to the Solace PubSub+ broker on the REST Port.

## How to run

There are two ways to run this utility

1. `npx @solace-community/asyncapi-to-postman -f <path_to_asyncAPI_file> [OPTIONS]` OR
1. `npm install @solace-community/asyncapi-to-postman -g` then execute command from anywhere in terminal via `asyncapi-to-postman -f <path_to_asyncAPI_file> [OPTIONS]`

Below are the following options

| Flag          | Description                                                | Type                    | Default                          |
| ------------- | ---------------------------------------------------------- | ----------------------- | -------------------------------- |
| -v, --version | Outputs the version number                                 |                         |                                  |
| -h, --host    | Destination Solace PubSub+ Broker in the form of host:port | `<host>:<port>`         | `http://localhost:9000`          |
| -u, --user    | Destination Solace PubSub+ Broker username:password        | `<username>:<password>` | `default:default`                |
| -s, --semp    | Destination Solace PubSub+ Broker SEMP credentials         | `<username>:<password>` | `admin:admin`                    |
| -o, --output  | Destination Solace PubSub+ Broker SEMP credentials         | `<username>:<password>` | `<asyncAPIFileName_collections>` |
| --help        | Output file name                                           |                         |                                  |

## Development

To run this cli tool locally

1. Clone this repo
1. `npm install`
1. `node index --help`

## Contribution

To contribute to this CLI tool

1. Fork this repo
1. Update the package.json version number
1. Make a PR
