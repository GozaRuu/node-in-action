const passport          = require('passport');
const LocalStrategy     = require('passport-local');
const GitHubStrategy    = require('passport-github').Strategy;
const bcrypt            = require('bcrypt');
const ObjectID          = require('mongodb').ObjectID;

module.exports = (app, db) => {

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser((id, done) => {
    db.collection('socialusers').findOne(
      {_id: new ObjectID(id)},
      (err, doc) => {
        if(doc) {
          done(null, doc);
          return;
        }
        db.collection('users').findOne(
          {_id: new ObjectID(id)},
          (err, doc) => {
            done(null, doc);
          }
        );
      }
    );
  });

  passport.use(new LocalStrategy(
    (username, password, done) => {
      db.collection('users').findOne({ username: username }, function (err, user) {
        console.log('User '+ username +' attempted to log in.');
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        if (!bcrypt.compareSync(password, user.password)) { return done(null, false); }
        return done(null, user);
      });
    }
  ));
  
  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_AUTH_CALLBACK
  },
  (accessToken, refreshToken, profile, done) => {
    db.collection('socialusers').findAndModify(
      {id: profile.id},
      {},
      {$setOnInsert:{
          id: profile.id,
          name: profile.displayName || 'John Doe',
          photo: profile.photos[0].value || '',
          email: profile.emails[0].value || 'No public email',
          created_on: new Date(),
          provider: profile.provider || ''
      },$set:{
          last_login: new Date()
      },$inc:{
          login_count: 1
      }},
      {upsert:true, new: true},
      (err, doc) => {
        console.log(doc);
        return done(null, doc.value);
      }
      );
    }
  ));
}