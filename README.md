# mobile-web-app-with-node-api-rest


# 1- Installation Node.js to ubuntu
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2- Confirm Node.js was Successfully Installed
  node -v
# 3- Finally, Update Your Version of npm
  sudo npm install npm --global
# 4- Installation for Windows

https://nodejs.org/en/download/

# create new node-test folder
  md node-test
  and then go to with cd node-test to folder
# run from terminal or CLI ;
  npm init (enter or fill it)
# intsalling express and other packages
  npm install express --save
  npm install jsonwebtoken --save
  npm install passport --save (its for local strategy)
  npm install cors --save (for cross borwser)
  npm install sqlite3 --save (for sqlite.DB)
  npm install express-fileupload --save( for file upload)
  npm install express-session --save
  
# clone files index.js and db.js to your node-test and create new folder named data or copy sample db from data folder
# and finally copy the www folder on your web server and;
run the node index.js

configure the index file
var nodeApiUrl = "<your_ip>";
var urlPort = "1337";

  thats it !
  then call your web server with index file 
  
  


