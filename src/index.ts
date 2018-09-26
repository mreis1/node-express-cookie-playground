import * as express from 'express';
const app = express();
import * as session from 'express-session';
import * as flash from 'express-flash';
import * as bodyParser from "body-parser";



app.use(session({secret: 'keyboard cat', cookie: {maxAge: 10 * 1000}}));
app.use(flash());
app.use(bodyParser());

app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html')
    if (req.session.views) {
        req.session.views++;
        res.write('<p>views: ' + req.session.views + '</p>')
        res.write('<p>expires in: ' + (req.session.cookie.maxAge / 1000) + 's</p>')
        res.write('<a href="/login">Login</a>')
        res.end()
    } else {
        req.session.views = 1
        res.write('<a href="/login">Login</a>')
        res.end('welcome to the session demo. refresh!')
    }
});

app.post('/login', function (req, res) {
    if (req.body.user === 'foo' && req.body.password === 'bar'){
        req.session.name = 'Márcio Reis';
        res.redirect('/dashboard');
    } else {
        (req as any).flash('fail', 'Invalid password.');
        (req as any).flash('fail', 'Better luck next time.');
        res.redirect('/login');
    }
});

app.get('/dashboard', function (req, res) {
    if (!req.session.name){
        return res.redirect('/login')
    }
    res.setHeader('Content-Type', 'text/html');
    res.write('<h1>Hello World ' + req.session.name + '</h1>');
    res.write('<a href="/logout">Logout</a>');
    res.end();
});
app.get('/logout', function (req, res) {
    delete req.session.name;
    res.redirect('/login')
});
app.get('/login', function (req, res) {
    if (req.session && req.session.name){
        res.redirect('/dashboard');
    } else {
        res.setHeader('Content-Type', 'text/html');
        let arr = (req as any).flash('fail');
        for (let a of arr) {
            res.write(`<div>${a}</div>`)
        }
        res.write(`<form method="post">
            <input type="text" name="user">
            <input type="password" name="password">
            <button type="submit">Send</button>
        </form>`);
        res.end();
    }
});


app.listen(9777);