# Coins
Market Cap List and Convertor for cyrpto currency.  Angular 4

## Setup
- Create Database and create .env file using example in "config" directory
- From project root, run npm install and composer install
- In backend_src/tools, run genEntities.php scrit from cli to auto generate database schema
- In backend/src/tools, run cryptoCompareImport.php to import coins and get any new coin icons/images

## Dev (Quick Start)
- In src/api, run php -S localhost:8080 for local php web server for api requests
- From project root, run ng serve (Note - you must have the latest angular-cli installed globally)


## SSL
To utilize certain apis server side from an insecure domain, you may need modify php.ini curl.cainfo
https://curl.haxx.se/ca/cacert.pem
--curl.cainfo = "path_to_cert\cacert.pem"
