const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const ensure = require('connect-ensure-login');
const _ = require('lodash');
const path = require('path');
const hbs = require('hbs');
const sgMail = require('@sendgrid/mail');
const port = process.env.PORT || 3000;
//
// Express Application
var app = express();

// Sets API key for sending sgMail

// In the case that it is run locally, require the config files
if (port === 3000) {
  // Not accessible in Heroku
  require('./config/config');
}
else {
  // Only want this set if this is Heroku
  app.set('views', __dirname + '/views');
}
// Registers all partials
hbs.registerPartials(__dirname + '/views/partials');
// Sets the view engine to .hbs
app.set('view engine', 'hbs');

var {mongoose} = require('./db/mongoose');
var {User} = require('./models/user');
var {Book} = require('./models/book');
var {Book_Note} = require('./models/book_notes');
var {Book_Quote} = require('./models/book_quotes');
var {Active_Book} = require('./models/active_books');
var {Activity_History} = require('./models/activity_history');
var {Message} = require('./models/messages');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + '../../../public'));
app.use(express.static(__dirname + '../../../public/home'));
app.use(express.static(__dirname + '../../../Images'));

app.use(session({
  secret: process.env.SECRET,
  saveUnitialized: true,
  resave: true
}));

//GET login.html
app.use(passport.initialize());
app.use(passport.session());

const auth = require('./authenticate/passport');

app.get('/', (req, res) => {
  res.redirect('/login');
});

app.get('/login', (req, res) => {
  res.render('login.hbs');
});

app.post('/login', passport.authenticate('local', {successReturnToOrRedirect: '/home', failureRedirect: '/login'}), (req, res) => {
  res.redirect('/home');
});

app.get('/create_account', (req, res) => {
  res.sendFile('/create_account.html', {root: __dirname + '../../create_account'});
});

app.post('/create_account', (req, res) => {
  var body = _.pick(req.body, ['first_name', 'last_name', 'email', 'password', 'confirmPassword', 'phone']);
  var user = new User(body);
  user.save();
  res.redirect('/login');
});

app.get('/home', ensure.ensureLoggedIn('/login'), (req, res) => {
  res.render('home.hbs', {
    first_name: req.user.first_name,
    home: true,
    my_library: false,
    active_books: false,
    book_notes: false,
    book_quotes: false,
    about: false,
    contact_us: false,
    account: false
  });
});

app.get('/my_library', ensure.ensureLoggedIn('/login'), (req, res) => {
  Book.find({user_id: req.user._id}, (err, books) => {
    if (!err) {
      var existingBooks = true;
      if (books.length === 0) {
        var existingBooks = false;
      }
      res.render('my_library.hbs', {
        home: false,
        my_library: true,
        active_books: false,
        book_notes: false,
        book_quotes: false,
        about: false,
        contact_us: false,
        account: false,
        books: books,
        existingBooks: existingBooks
      });
    } else {
      console.log(err);
    }
  });
});

app.get('/my_library/new_book', ensure.ensureLoggedIn('/login'), (req, res) => {
  res.render('new_book.hbs', {
    home: false,
    my_library: true,
    active_books: false,
    book_notes: false,
    book_quotes: false,
    about: false,
    contact_us: false,
    account: false
  });
});

app.post('/my_library/new_book', ensure.ensureLoggedIn('/login'), (req, res) => {
  var body = _.pick(req.body, ['book_title', 'authors', 'ISBN', 'gift_first_name', 'gift_last_name', 'date_gifted']);
  var book = new Book(body);
  book.user_id = req.user._id;
  book.save();
  res.redirect('/my_library');
});

app.post('/my_library/manage_books', ensure.ensureLoggedIn('/login'), (req, res) => {
  var selected_book_title = _.pick(req.body, ['select_book_title']);
  Book.find({user_id: req.user._id, book_title: selected_book_title.select_book_title}, (err, book) => {
    if (!err) {
      res.render('manage_books.hbs', {
        home: false,
        my_library: true,
        active_books: false,
        book_notes: false,
        book_quotes: false,
        about: false,
        contact_us: false,
        account: false,
        book: book
      });
    }
    else {
      console.log(err);
    }
  });
});

app.post('/my_library/manage_books/save', ensure.ensureLoggedIn('/login'), (req, res) => {
  var edited_book = _.pick(req.body, ['book_title', 'authors', 'ISBN', 'actively_lending', 'gift_first_name', 'gift_last_name', 'book_id']);
  Book.findByIdAndUpdate({user_id: req.user._id, _id: edited_book.book_id}, {$set: {
    book_title: edited_book.book_title,
    authors: edited_book.authors,
    ISBN: edited_book.ISBN,
    gift_first_name: edited_book.gift_first_name,
    gift_last_name: edited_book.gift_last_name
  }}, (err, book) => {
    if (!err) {
      res.redirect('/my_library');
    } else {
      console.log(err);
    }
  });
});

app.post('/my_library/manage_books/delete', ensure.ensureLoggedIn('/login'), (req, res) => {
  var book = _.pick(req.body, ['book_id', 'book_title']);
  Book_Note.remove({user_id: req.user._id, book_title: book.book_title}, (err) => {
    if (err) {
      console.log(err);
    }
    else {
      console.log('Deleted the book\'s notes successfully!');
    }
  });
  Book_Quote.remove({user_id: req.user._id, book_title: book.book_title}, (err) => {
    console.log(req.user._id + ' ' + book.book_title);
    if (err) {
      console.log(err);
    }
    else {
      console.log('Deleted the book\'s quotes successfully!');
    }
  });
  Book.remove({user_id: req.user._id, _id: book.book_id}, (err) => {
    if (err) {
      console.log(err);
    }
    else {
      console.log('Deleted book successfully!');
    }
  });
  res.redirect('/my_library');
});

app.get('/active_books', ensure.ensureLoggedIn('/login'), (req, res) => {
  Book.find({user_id: req.user._id}, (err, books) => {
    if (!err) {
      Activity_History.find({user_id: req.user_id}, (err, history) => {
        if (!err) {
          var existingBooks = true;
          if (books.length === 0) {
            var existingBooks = false;
          }
          var notLendingBooks = new Array();
          var lendingBooks = new Array();
          for (i = 0; i < books.length; i++) {
            if (books[i].actively_lending === false) {
              notLendingBooks.push(books[i])
            }
            else {
              lendingBooks.push(books[i]);
            }
          }
          var existingLending = true;
          if (lendingBooks.length === 0) {
            var existingLending = false;
          }
          var notLending = true;
          if ((books.length - lendingBooks.length) === 0) {
            var notLending = false;
          }
          var historyLending = true;
          if (history.length === 0) {
            var historyLending = false;
          }
          Active_Book.find({user_id: req.user._id}, (err, active_books) => {
            if (!err) {
              res.render('active_books.hbs', {
                home: false,
                my_library: false,
                active_books_page: true,
                book_notes: false,
                book_quotes: false,
                about: false,
                contact_us: false,
                account: false,
                notLendingBooks: notLendingBooks,
                lendingBooks: lendingBooks,
                active_books: active_books,
                existingBooks: existingBooks,
                existingLending: existingLending,
                historyLending: historyLending,
                notLending: notLending
              });
            } else {
              console.log(err);
            }
          });
        } else {
          console.log(err);
        }
      });
    } else {
      console.log(err);
    }
  });
});

app.post('/active_books/loan_book', ensure.ensureLoggedIn('/login'), (req, res) => {
  var book_title = _.pick(req.body, ['select_book_title']);
  res.render('loan_book.hbs', {
    home: false,
    my_library: false,
    active_books_page: true,
    book_notes: false,
    book_quotes: false,
    about: false,
    contact_us: false,
    account: false,
    book_title: book_title.select_book_title
  });
});

app.post('/active_books/loan_book/loan', ensure.ensureLoggedIn('/login'), (req, res) => {
  var body = _.pick(req.body, ['book_title', 'loaned_to', 'date_loaned', 'phone', 'email', 'comments']);
  var active_book = new Active_Book(body);
  active_book.user_id = req.user._id;
  active_book.save();
  Book.update({user_id: req.user._id, book_title: body.book_title}, {$set: {
    actively_lending: true
  }}, (err, book) => {
    if (!err) {
      res.redirect('/active_books');
    }
  });
});

app.post('/active_books/edit_loaned_book', ensure.ensureLoggedIn('/login'), (req, res) => {
  var book_title = _.pick(req.body, ['select_book_title']);
  Active_Book.find({user_id: req.user._id, book_title: book_title.select_book_title}, (err, loaning_book) => {
    res.render('edit_loaned_book.hbs', {
      home: false,
      my_library: false,
      active_books_page: true,
      book_notes: false,
      book_quotes: false,
      about: false,
      contact_us: false,
      account: false,
      loaning_book: loaning_book
    });
  });
});

app.post('/active_books/edit_loaned_book/save', ensure.ensureLoggedIn('/login'), (req, res) => {
  var body = _.pick(req.body, ['_id', 'loaned_to', 'new_date_loaned', 'phone', 'email', 'comments']);
  if (body.new_date_loaned === '') {
    Active_Book.findByIdAndUpdate({user_id: req.user._id, _id: body._id}, {$set: {
      loaned_to: body.loaned_to,
      phone: body.phone,
      email: body.email,
      comments: body.comments
    }}, (err) => {
      if (!err) {
        res.redirect('/active_books');
      }
      console.log(err);
    });
  } else {
    Active_Book.findByIdAndUpdate({user_id: req.user._id, _id: body._id}, {$set: {
      loaned_to: body.loaned_to,
      date_loaned: body.new_date_loaned,
      phone: body.phone,
      email: body.email,
      comments: body.comments
    }}, (err) => {
      if (!err) {
        res.redirect('/active_books');
      }
      console.log(err);
    });
  }
});

app.post('/active_books/edit_loaned_book/delete', ensure.ensureLoggedIn('/login'), (req, res) => {
  var body = _.pick(req.body, ['book_title', '_id']);
  Book.update({user_id: req.user._id, book_title: body.book_title}, {$set: {
    actively_lending: false
  }}, (err, book) => {
    if (!err) {
      Active_Book.remove({user_id: req.user._id, _id: body._id}, (err) => {
        if (!err) {
          res.redirect('/active_books');
        }
        else {
          console.log(err);
        }
      });
    } else {
      console.log(err);
    }
  });
});

app.post('/active_books/return_book', ensure.ensureLoggedIn('/login'), (req, res) => {
  var body = _.pick(req.body, ['select_book_title']);
  res.render('return_book.hbs', {
    home: false,
    my_library: false,
    active_books_page: true,
    book_notes: false,
    book_quotes: false,
    about: false,
    contact_us: false,
    account: false,
    loaning_book: body.select_book_title
  });
});

app.post('/active_books/return_book/post', ensure.ensureLoggedIn('/login'), (req, res) => {
  var body = _.pick(req.body, ['selected_book_title', 'date_returned', 'additional_comments']);
  Active_Book.findOne({user_id: req.user._id, book_title: body.selected_book_title}, (err, active_book) => {
    if (!err) {
      var activity_history = new Activity_History();
      activity_history.user_id = req.user._id;
      activity_history.book_title = active_book.book_title;
      activity_history.loaned_to = active_book.loaned_to;
      activity_history.date_loaned = active_book.date_loaned;
      activity_history.date_returned = body.date_returned;
      activity_history.phone = active_book.phone;
      activity_history.email = active_book.email;
      activity_history.comments = active_book.comments;
      activity_history.post_activity_comments = body.additional_comments;
      activity_history.save();
      Book.update({user_id: req.user._id, book_title: body.selected_book_title}, {$set: {
        actively_lending: false
      }}, (err) => {
        if (err) {
          console.log('no error there');
        }
      });
      Active_Book.remove({user_id: req.user._id, book_title: body.selected_book_title}, (err) => {
        if (!err) {
          res.redirect('/my_library');
        } else {
        console.log('no error anywhere');
        }
      });
    } else {
    console.log('no error here');
    }
  });
});

app.get('/active_books/lending_history', ensure.ensureLoggedIn('/login'), (req, res) => {
  Activity_History.find({user_id: req.user._id}, (err, history) => {
    if (!err) {
      res.render('lending_history.hbs', {
        home: false,
        my_library: false,
        active_books_page: true,
        book_notes: false,
        book_quotes: false,
        about: false,
        contact_us: false,
        account: false,
        history: history
      });
    } else {
      console.log(err);
    }
  });
});

app.get('/book_notes', ensure.ensureLoggedIn('/login'), (req, res) => {
  Book_Note.find({user_id: req.user._id}, (err, notes) => {
    if (!err) {
      Book.find({user_id: req.user._id}, (err, books) => {
        if(!err) {
          var existingBooks = true;
          if (books.length === 0) {
            var existingBooks = false;
          }
          var existingNotes = true;
          if (notes.length === 0) {
            var existingNotes = false;
          }
          res.render('book_notes.hbs', {
            home: false,
            my_library: false,
            active_books: false,
            book_notes: true,
            book_quotes: false,
            about: false,
            contact_us: false,
            account: false,
            notes: notes,
            existingBooks: existingBooks,
            existingNotes: existingNotes
          });
        } else {
          console.log(err);
        }
      });
    } else {
      console.log(err);
    }
  });
});

app.get('/book_notes/new_note', ensure.ensureLoggedIn('/login'), (req, res) => {
  Book.find({user_id: req.user._id}, (err, books) => {
    if (!err) {
      res.render('new_note.hbs', {
        home: false,
        my_library: false,
        active_books: false,
        book_notes: true,
        book_quotes: false,
        about: false,
        contact_us: false,
        account: false,
        books: books
      });
    } else {
      console.log(err);
    }
  });
});

app.post('/book_notes/new_note', ensure.ensureLoggedIn('/login'), (req, res) => {
  var body = _.pick(req.body, ['book_title', 'note_title', 'note']);
  var book_note = new Book_Note(body);
  book_note.user_id = req.user._id;
  book_note.save();
  res.redirect('/book_notes');
});

app.post('/book_notes/manage_notes', ensure.ensureLoggedIn('/login'), (req, res) => {
  var selected_note_title = _.pick(req.body, ['select_note_title']);
  Book_Note.find({user_id: req.user._id, note_title: selected_note_title.select_note_title}, (err, note) => {
    if (!err) {
      res.render('manage_notes.hbs', {
        home: false,
        my_library: false,
        active_books: false,
        book_notes: true,
        book_quotes: false,
        about: false,
        contact_us: false,
        account: false,
        note: note
      });
    }
    else {
      console.log(err);
    }
  });
});

app.post('/book_notes/manage_notes/save', ensure.ensureLoggedIn('/login'), (req, res) => {
  var edited_note = _.pick(req.body, ['note_id', 'note_title', 'note']);
  Book_Note.findByIdAndUpdate({user_id: req.user._id, _id: edited_note.note_id}, {$set: {
    note_title: edited_note.note_title,
    note: edited_note.note
  }}, (err, book) => {
    if (!err) {
      res.redirect('/book_notes');
    }
    console.log(err);
  });
});

app.post('/book_notes/manage_notes/delete', ensure.ensureLoggedIn('/login'), (req, res) => {
  var note = _.pick(req.body, ['book_id', 'note_title']);
  Book_Note.remove({user_id: req.user._id, note_title: note.note_title}, (err) => {
    if (!err) {
      res.redirect('/book_notes');
    }
    else {
      console.log(err);
    }
  });
});

app.get('/book_quotes', ensure.ensureLoggedIn('/login'), (req, res) => {
  Book_Quote.find({user_id: req.user._id}, (err, quotes) => {
    if (!err) {
      Book.find({user_id: req.user._id}, (err, books) => {
        if(!err) {
          var existingBooks = true;
          if (books.length === 0) {
            var existingBooks = false;
          }
          var existingQuotes = true;
          if (quotes.length === 0) {
            var existingQuotes = false;
          }
          res.render('book_quotes.hbs', {
            home: false,
            my_library: false,
            active_books: false,
            book_notes: false,
            book_quotes: true,
            about: false,
            contact_us: false,
            account: false,
            quotes: quotes,
            existingBooks: existingBooks,
            existingQuotes: existingQuotes
          });
        } else {
          console.log(err);
        }
      });
    }
    else {
      console.log(err);
    }
  });
});

app.get('/book_quotes/new_quote', ensure.ensureLoggedIn('/login'), (req, res) => {
  Book.find({user_id: req.user._id}, (err, books) => {
    if (!err) {
      res.render('new_quote.hbs', {
        home: false,
        my_library: false,
        active_books: false,
        book_notes: false,
        book_quotes: true,
        about: false,
        contact_us: false,
        account: false,
        books: books
      });
    } else {
      console.log(err);
    }
  });
});

app.post('/book_quotes/new_quote', ensure.ensureLoggedIn('/login'), (req, res) => {
  var body = _.pick(req.body, ['book_title', 'quote_title', 'quote']);
  var book_quote = new Book_Quote(body);
  book_quote.user_id = req.user._id;
  book_quote.save();
  res.redirect('/book_quotes');
});

app.post('/book_quotes/manage_quotes', ensure.ensureLoggedIn('/login'), (req, res) => {
  var selected_quote_title = _.pick(req.body, ['select_quote_title']);
  Book_Quote.find({user_id: req.user._id, quote_title: selected_quote_title.select_quote_title}, (err, quote) => {
    if (!err) {
      res.render('manage_quotes.hbs', {
        home: false,
        my_library: false,
        active_books: false,
        book_notes: false,
        book_quotes: true,
        about: false,
        contact_us: false,
        account: false,
        quote: quote
      });
    }
    else {
      console.log(err);
    }
  });
});

app.post('/book_quotes/manage_quotes/save', ensure.ensureLoggedIn('/login'), (req, res) => {
  var edited_quote = _.pick(req.body, ['quote_id', 'quote_title', 'quote']);
  Book_Quote.findByIdAndUpdate({user_id: req.user._id, _id: edited_quote.quote_id}, {$set: {
    quote_title: edited_quote.quote_title,
    quote: edited_quote.quote
  }}, (err, quote) => {
    if (!err) {
      res.redirect('/book_quotes');
    } else {
      console.log(err);
    }
  });
});

app.post('/book_quotes/manage_quotes/delete', ensure.ensureLoggedIn('/login'), (req, res) => {
  var quote = _.pick(req.body, ['book_id', 'quote_title']);
  Book_Quote.remove({user_id: req.user._id, quote_title: quote.quote_title}, (err) => {
    if (!err) {
      res.redirect('/book_quotes');
    }
    else {
      console.log(err);
    }
  });
});

app.get('/about', ensure.ensureLoggedIn('/login'), (req, res) => {
  res.render('about.hbs', {
    home: false,
    my_library: false,
    active_books: false,
    book_notes: false,
    book_quotes: false,
    about: true,
    contact_us: false,
    account: false
  });
});

app.get('/contact_us', ensure.ensureLoggedIn('/login'), (req, res) => {
  res.render('contact_us.hbs', {
    home: false,
    my_library: false,
    active_books: false,
    book_notes: false,
    book_quotes: false,
    about: false,
    contact_us: true,
    account: false
  });
});
app.post('/contact_us', ensure.ensureLoggedIn('/login'), (req, res) => {
  var message = _.pick(req.body, ['subject', 'message']);
  var newMessage = new Message(message);
  newMessage.user_id = req.user._id;
  newMessage.save();
  sgMail.setApiKey(process.env.SENDGRID);
  const msg = {
    to: req.user.email,
    from: 'HomeBookShelf@customersupport.com',
    subject: 'Your Message To Us!',
    text: 'Thank you so much for getting in contact with us! We will be getting in contact with you shortly!',
    html: '<strong>Thank you so much for getting in contact with us! We will be getting in contact with you shortly!</strong>'
  };
  sgMail.send(msg);
  res.render('home.hbs', {
    home: true,
    my_library: false,
    active_books: false,
    book_notes: false,
    book_quotes: false,
    about: false,
    contact_us: false,
    account: false
  });
});

app.get('/account', ensure.ensureLoggedIn('/login'), (req, res) => {
  res.render('account.hbs', {
    first_name: req.user.first_name,
    last_name: req.user.last_name,
    email: req.user.email,
    home: false,
    my_library: false,
    active_books: false,
    book_notes: false,
    book_quotes: false,
    about: false,
    contact_us: false,
    account: true
  });
});

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});

// Listen on port 3000
app.listen(port, function() {
    console.log(`Express app listening on port ${port}`);
});
