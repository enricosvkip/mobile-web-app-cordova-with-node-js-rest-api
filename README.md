# mobile-web-app-with-node-api-rest-and-cors


# 1- Installation Node.js to ubuntu
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2- Confirm Node.js was Successfully Installed
  node -v
# 3- Finally, Update Your Version of npm
  sudo npm install npm --global<br>
# 4- Installation for Windows

https://nodejs.org/en/download/

# create new node-test folder
  md node-test<br>
  and then go to with cd node-test to folder
# run from terminal or CLI ;
  npm init (enter or fill it)
# intsalling express and other packages
  npm install express --save<br>
  npm install jsonwebtoken --save<br>
  npm install passport --save (its for local strategy)<br>
  npm install cors --save (for cross borwser)<br>
  npm install sqlite3 --save (for sqlite.DB)<br>
  npm install express-fileupload --save( for file upload)<br>
  npm install express-session --save<br>
  
# clone files index.js and db.js to your node-test and create new folder named data or copy sample db from data folder
# and finally copy the www folder on your web server and;
run the node index.js

configure the index file:<br>
var nodeApiUrl = "<your_ip>";<br>
var urlPort = "1337";<br>

  thats it !<br>
  then call your web server with index file 
  
  


