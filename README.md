[![Standard - JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

# Tracim sidebar left
Display the left sidebar of Tracim containing the list of workspaces and their content

## Setup
### Node js
```
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### install all dependencies
```
npm install
```

### Start mock api server
```
npm run start-static-mockapi
```
Api will listen to port 3083

## Build
### Build all sources
```
npm run build
```
#### To run the app 
open /dist/index.html in a web server
