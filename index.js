import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import session from 'express-session';
import passport from 'passport';
import Strategy from 'passport-local';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const saltRounds = parseInt(process.env.SALT_ROUNDS, 10);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
  },
}));

app.use(passport.initialize());
app.use(passport.session());

const db = new pg.Client({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.PG_PORT,
});
db.connect();

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.get("/secrets", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("secrets.ejs");
  } else {
    res.redirect("/login");
  }
});

app.post("/register", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;

  try {
    const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [email]);

    if (checkResult.rows.length > 0) {
      res.send("Email already exists. Try logging in.");
    } else {
      const hash = await bcrypt.hash(password, saltRounds);
      const result = await db.query(
        "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
        [email, hash]
      );
      const user = result.rows[0];
      req.login(user, (err) => {
        if (err) {
          console.error("Login error:", err);
        } else {
          res.redirect("/secrets");
        }
      });
    }
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).send("Internal server error");
  }
});

app.post("/login", passport.authenticate("local", {
  successRedirect: "/secrets",
  failureRedirect: "/login",
}));

passport.use(new Strategy(async (username, password, cb) => {
  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [username]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      const storedHashedPassword = user.password;
      const isMatch = await bcrypt.compare(password, storedHashedPassword);
      if (isMatch) {
        return cb(null, user);
      } else {
        return cb(null, false, { message: 'Incorrect password.' });
      }
    } else {
      return cb(null, false, { message: 'User not found.' });
    }
  } catch (err) {
    return cb(err);
  }
}));

app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).send("Internal server error");
    }
    res.redirect("/");
  });
});


passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser(async (id, cb) => {
  try {
    const result = await db.query("SELECT * FROM users WHERE id = $1", [id]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      cb(null, user);
    } else {
      cb(new Error("User not found"));
    }
  } catch (err) {
    cb(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
