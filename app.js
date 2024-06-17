const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const MongoStore = require('connect-mongo');

const itemsRouter = require('./routes/items');
const ordersRouter = require('./routes/orders');
const categoriesRouter = require('./routes/categories');
const authRouter = require('./routes/users');
const seed = require('./scripts/seed');
const User = require('./models/User');
require('./config/passport')(passport);
const app = express();


app.use(cors());
app.use(express.json());


mongoose.connect('mongodb://localhost:27017/online-delivery', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', async () => {
  console.log('Connected to MongoDB');


  const categoriesCount = await mongoose.model('Category').countDocuments();
  const itemsCount = await mongoose.model('Item').countDocuments();

  if (categoriesCount === 0 && itemsCount === 0) {
    // Δεν υπάρχουν δεδομένα, οπότε καλέστε τη seed()
    await seed();
  } else {
    console.log('Database already seeded. Skipping...');
  }
});


app.use(session({
  secret: 'yourSecretKey',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: 'mongodb://localhost:27017/online-delivery' })
}));


app.use(passport.initialize());
app.use(passport.session());


passport.use(new LocalStrategy(
    async function(username, password, done) {
      try {
        const user = await User.findOne({ username });

        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
          return done(null, false, { message: 'Incorrect password.' });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/items', itemsRouter);
app.use('/orders', ordersRouter);
app.use('/categories', categoriesRouter);
app.use('/users', authRouter);

// 404 Error handling
app.use((req, res, next) => {
  res.status(404).send('Not Found');
});

module.exports = app;
