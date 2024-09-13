To install for development:
===
Install git and then:  
`$ git clone https://github.com/ZeDeCe/InternetApps-Final-Project.git`  
Install mongodb from here:  
https://www.mongodb.com/try/download/community  
Install nvm from here:  
https://github.com/coreybutler/nvm-windows/releases  

Create a config file for your local system:
1. Under the main folder of the project create a directory called "config"
2. Under config create a file called .env (/config/.env)
3. In the config file fill the fields for the following:
```
DB_HOST=
PORT=
DB_PORT=
DB_USER=
DB_PASS=
DB_URL=
SESSION_SECRET=
MAPS_TOKEN=
TWITTER_ID=
FACEBOOK_ID=
```
Make sure to have the DB_URL end in a /  
Session secret can be some random string- this will change in production so it is temporary

TWITTER_ID && FACEBOOK_ID are the id from the link.
example:
for twitter = x.com/{TWITTER_ID}
for facebook = facebook.com/profile.php?id={FACEBOOK_ID}
MAPS Token is received from Google Cloud Platform by creating API Token for maps.

Open visual studio and in a terminal execute the following:
```
$ nvm install lts
$ nvm use lts
$ node -v & npm -v
```
If the last command returned versions for npm and node continue to the next step  
Run the following:
`npm install`

Now attempt to run the program so it creates your DB, then do the following:
1. Open the mongodb compass app
2. Add a user to the users collection under test that has: _id: username, password: password, isAdmin: false
  
To run the program:
---
1. In dev mode using nodemon: `npm run serverstart`
2. In dev mode using nodemon without DEBUG flag: `npm run devstart`
3. In production: `npm start`
