var mysql = require('./dbcon.js');
const express = require('express');
const exphbs = require('express-handlebars');
const app = express();
app.use('/static', express.static('static'));

//app.use(express.urlencoded({extended:false}));
app.use(express.json());
const port = process.env.PORT || 3000
app.set('port', port);

app.engine('hbs', exphbs({
    extname: 'hbs',
    defaultLayout: 'main',
    layoutsDir: __dirname + '/views/layouts/',
    partialsDir: __dirname + '/views/partials/'
}));

app.set('view engine', 'hbs');

app.use('/static', express.static('static'));
app.use(express.static(__dirname + '/public'));
app.use('/public', express.static(__dirname + '/public'));
app.use('/glide', express.static('node_modules/@glidejs/glide/dist/'));
app.get('/', (req, res) => {
    res.render('home', {});
});

/* body-parser used for parsing post requests as JSON */
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.get('/classes', (req, res) => {
    mysql.pool.query('SELECT DISTINCT class_name, class_description FROM Classes ORDER BY class_name ASC',
        async function (error, rows) {
            if (error) {
                res.send({
                    "code": 400,
                    "failed": "error ocurred"
                })
            }
            res.render('classes', { rows: rows });
        });

});

app.post('/AddClass', (req, res) => {
    function new_class(req, res) {
        //adds new location to Locations table
        return new Promise(function (resolve, reject) {
            var query = mysql.pool.query('INSERT INTO Classes (class_name, class_description) VALUES (?,?)', [req.body.className, req.body.classDescription],
                function (error) {
                    if (error) {
                        res.send({
                            "code": 400,
                            "failed": "error ocurred"
                        })
                    }
                    added = {};
                    added.success = "New class successfully added";
                    resolve(added)
                });
        })
    }
    function all_classes(req, res) {
        // Pulls capacity values to pre-populates capacity element in Search form
        return new Promise(function (resolve, reject) {
            var query = mysql.pool.query('SELECT DISTINCT class_name, class_description FROM Classes ORDER BY class_name ASC',
                async function (error, rows) {
                    if (error) {
                        res.send({
                            "code": 400,
                            "failed": "error ocurred"
                        })
                    }
                    resolve(rows)
                });
        })
    }

    // function returns search results and updates search form's capacity drop down
    async function addClass(req, res) {
        let added = await new_class(req);
        let rows = await all_classes(req, res);

        res.render('classes', { rows: rows, added: added });
    }
    addClass(req, res)
});


function all_CT(req) {
    // gets locations data for dropdown element
    return new Promise(function (resolve, reject) {
        var query = mysql.pool.query('SELECT DISTINCT l.location_name, c.class_time_id, c.day, c.start_time, c.end_time, s.teacher_id, cl.class_name, s.quarter, s.session_name, ' +
            'CONCAT_WS(" ", t.f_name, t.l_name) as full_name FROM Class_Times c ' +
            'LEFT JOIN Sessions s ON c.session_id = s.session_id ' +
            'LEFT JOIN Teachers t ON s.teacher_id = t.teacher_id ' +
            'LEFT JOIN Locations l ON c.location_id = l.location_id ' +
            'LEFT JOIN Classes cl ON cl.class_id = s.class_id ' +
            'ORDER BY c.day, c.start_time ASC',
            async function (error, class_times) {
                if (error) {
                    res.send({
                        "code": 400,
                        "failed": "error ocurred"
                    })
                }
                class_times.forEach(element => {
                    days = { 0: "Monday", 1: "Tuesday", 2: "Wednesday", 3: "Thursday", 4: "Friday" }
                    element.day = days[element.day]
                });
                resolve(class_times);
            });
    })
}

function class_timeDropdown1(req) {
    // gets sessions data for dropdown element
    return new Promise(function (resolve, reject) {
        var query = mysql.pool.query('SELECT Sessions.session_id, Classes.class_name, Sessions.quarter, Sessions.session_name FROM Sessions INNER JOIN Classes on Classes.class_id = Sessions.class_id',
            async function (error, sessions) {
                if (error) {
                    res.send({
                        "code": 400,
                        "failed": "error ocurred"
                    })
                }
                resolve(sessions);
            });
    })
};
function class_timeDropdown2(req) {
    // gets locations data for dropdown element
    return new Promise(function (resolve, reject) {
        var query = mysql.pool.query('SELECT location_id, location_name FROM Locations',
            async function (error, locations) {
                if (error) {
                    res.send({
                        "code": 400,
                        "failed": "error ocurred"
                    })
                }
                resolve(locations);
            });
    })
};

app.get('/class_times', (req, res) => {
    // initial rendering of Class Times page
    // function returns data to pre-populate form dropdown elements
    async function get_class_times(req, res) {
        let results = await all_CT(req)
        let sessions = await class_timeDropdown1(req);
        let locations = await class_timeDropdown2(req);

        res.render('class_times', { results: results, sessions: sessions, locations: locations });
    }
    get_class_times(req, res)
});

app.get('/SearchClassTimes', (req, res) => {
    // Renders Class Times page with search results
    function search_CT(req) {
        // gets sessions data for dropdown element
        return new Promise(function (resolve, reject) {
            var { session_id, location_id, day } = req.query;
            var query = mysql.pool.query('SELECT l.location_name, c.class_time_id, c.day, c.start_time, c.end_time, s.teacher_id, cl.class_name, s.quarter, s.session_name, ' +
                'CONCAT_WS(" ", t.f_name, t.l_name) as full_name FROM Class_Times c ' +
                'LEFT JOIN Sessions s ON c.session_id = s.session_id ' +
                'LEFT JOIN Teachers t ON s.teacher_id = t.teacher_id ' +
                'LEFT JOIN Locations l ON c.location_id = l.location_id ' +
                'LEFT JOIN Classes cl ON cl.class_id = s.class_id ' +
                'WHERE c.session_id = ? AND c.location_id = ? AND day = ? ' +
                'ORDER BY c.start_time ASC', [session_id, location_id, day],
                async function (error, results) {
                    if (error) {
                        res.send({
                            "code": 400,
                            "failed": "error ocurred"
                        })
                    }
                    resolve(results);
                });
        })
    }

    // function returns data to pre-populate form dropdown elements
    async function get_class_times(req, res) {
        let results = await search_CT(req);
        let sessions = await class_timeDropdown1(req);
        let locations = await class_timeDropdown2(req);

        res.render('class_times', { results: results, sessions: sessions, locations: locations });
    }
    get_class_times(req, res)
});

app.delete('/api/deleteClassTime', (req, res) => {
    // Renders Class Times page with search results
    function delete_class_time(req) {
        // gets sessions data for dropdown element
        return new Promise(function (resolve, reject) {
            var query = mysql.pool.query('DELETE FROM Class_Times WHERE class_time_id = ?', [req.body.class_time_id],
                async function (error, results) {
                    if (error) {
                        res.send({
                            "code": 400,
                            "failed": "error ocurred"
                        })
                    }
                    deleted = "Class session deleted from schedule";
                    resolve(deleted);
                });
        })
    }

    // function returns data to pre-populate form dropdown elements
    async function deleteCT(req, res) {
        let deleted = await delete_class_time(req);
        let sessions = await class_timeDropdown1(req);
        let locations = await class_timeDropdown2(req);

        res.render('class_times', { sessions: sessions, locations: locations });
    }
    deleteCT(req, res)
});

app.post('/AddClassTime', (req, res) => {
    function check_unique(req) {
        //adds new location to Locations table
        return new Promise(function (resolve, reject) {
            var { day, start_time, end_time, location } = req.body;
            start_time = start_time.slice(0, 2) + start_time.slice(3,) + "00"
            end_time = end_time.slice(0, 2) + end_time.slice(3,) + "00"
            var query = mysql.pool.query('SELECT * FROM Class_Times WHERE day = ? AND location_id = ? AND' +
                '((start_time BETWEEN (SELECT STR_TO_DATE(' + start_time + ',"%h%i%s")) AND (SELECT STR_TO_DATE(' + end_time + ',"%h%i%s"))) OR ' +
                '(end_time BETWEEN (SELECT STR_TO_DATE(' + start_time + ',"%h%i%s")) AND (SELECT STR_TO_DATE(' + end_time + ',"%h%i%s"))) OR ' +
                '((SELECT STR_TO_DATE(' + start_time + ',"%h%i%s")) BETWEEN start_time AND end_time))', [day, location],
                function (error, rows) {
                    if (error) {
                        res.send({
                            "code": 400,
                            "failed": "error ocurred"
                        })
                    }
                    check = {};
                    results = JSON.stringify(rows);
                    results = JSON.parse(results)
                    if (results.length != 0) {
                        check.result = "Unable to add class time as it is already reserved. Please try a different location, date and time combination.";
                        resolve(check)
                    }
                    else {
                        check.result = "Unique";
                        resolve(check)
                    }
                });
        })
    }

    function add_CT(req, check_results) {
        //adds new location to Locations table
        return new Promise(function (resolve, reject) {
            var { day, start_time, end_time, location, session } = req.body;
            var query = mysql.pool.query('INSERT INTO Class_Times (day, start_time, end_time, location_id, session_id) VALUES (?,?,?,?,?)', [day, start_time, end_time, location, session],
                function (error) {
                    if (error) {
                        res.send({
                            "code": 400,
                            "failed": "error ocurred"
                        })
                    }
                    added = {};
                    added.success = "New class time successfully added";
                    resolve(added)
                });
        })
    }

    // function adds new class time to Class_Times table and gets data to pre-populate form dropdown elements
    async function add_class_time(req, res) {
        let check = await check_unique(req);

        if (check.result == "Unique") {
            let added = await add_CT(req, check);
            let sessions = await class_timeDropdown1(req);
            let locations = await class_timeDropdown2(req);
            let results = await all_CT(req);

            res.render('class_times', { added: added, sessions: sessions, locations: locations, results: results });

        }
        else {
            let sessions = await class_timeDropdown1(req);
            let locations = await class_timeDropdown2(req);
            let results = await all_CT(req);

            res.render('class_times', { check: check, sessions: sessions, locations: locations, results: results });
        }
    }
    add_class_time(req, res)
});

// retreieves all locations data from Locations table
function all_locations(req, res) {
    //adds new location to Locations table
    return new Promise(function (resolve, reject) {
        var query = mysql.pool.query('SELECT * FROM Locations ORDER BY location_name ASC',
            function (error, locations) {
                if (error) {
                    res.send({
                        "code": 400,
                        "failed": "error ocurred"
                    })
                }
                locations.forEach(element => {
                    indoor = { 0: "Outdoors", 1: "Indoors" }
                    element.indoor = indoor[element.indoor]
                });
                resolve(locations)
            });
    })
};

//pre-populates capacity element in Search form
function capacity_dropdown(req) {
    //adds new location to Locations table
    return new Promise(function (resolve, reject) {
        var query = mysql.pool.query('SELECT DISTINCT capacity FROM Locations ORDER BY capacity ASC',
            function (error, rows) {
                if (error) {
                    next(error);
                    return;
                }
                resolve(rows);
            });
    })
};

app.get('/locations', (req, res, next) => {
    // Renders page and pre-populates capacity element in Search form
    async function locations(req, res) {
        let results = await all_locations(req, res);
        let rows = await capacity_dropdown(req);

        res.render('locations', { rows: rows, results: results });
    }
    locations(req, res)
});

app.get('/FindLocation', (req, res) => {
    function search_results(req) {
        // gets Locations results per serach criteria
        return new Promise(function (resolve, reject) {
            var query = mysql.pool.query('SELECT * FROM Locations WHERE indoor = ? AND capacity = ? ORDER BY location_name ASC', [req.query.indoor, req.query.capacity],
                async function (error, results) {
                    if (error) {
                        res.send({
                            "code": 400,
                            "failed": "error ocurred"
                        })
                    }
                    rows = JSON.parse(JSON.stringify(results));
                    if (rows.length == 0) {
                        results = [JSON.parse('{ "location_name":"There are 0 results matching your search criteria. Please try again.", "indoor":" ", "capacity":" "}')]
                    }
                    if (rows.length != 0) {
                        rows.forEach(element => {
                            indoor = { 0: "Outdoors", 1: "Indoors" }
                            element.indoor = indoor[element.indoor]
                        });
                    }
                    resolve(results);
                });
        })
    }

    // function returns search results and updates search form's capacity drop down
    async function findLocation(req, res) {
        let results = await search_results(req);
        let rows = await capacity_dropdown(req, res);

        res.render('locations', { rows: rows, results: results });
    }
    findLocation(req, res);
});

app.post('/AddLocation', (req, res) => {
    function new_location(req, res) {
        //adds new location to Locations table
        return new Promise(function (resolve, reject) {
            var query = mysql.pool.query('INSERT INTO Locations (location_name, indoor, capacity) VALUES (?,?,?)', [req.body.name, req.body.indoor, req.body.capacity],
                function (error) {
                    if (error) {
                        res.send({
                            "code": 400,
                            "failed": "error ocurred"
                        })
                    }
                    added = {};
                    added.success = "New location successfully added";
                    resolve(added)
                });
        })
    }

    // function returns search results and updates search form's capacity drop down
    async function addLocation(req, res) {
        let added = await new_location(req);
        let rows = await capacity_dropdown(req, res);
        let results = await all_locations(req, res);

        res.render('locations', { results: results, rows: rows, added: added });
    }
    addLocation(req, res, next)
});

app.get('/students', (req, res, next) => {
    mysql.pool.query(studentsGetAllQuery, (err, rows, fields) => {
        if (err) {
            next(err);
            return;
        }
        res.render('students', { rows: rows });
    });
});

const studentInsertQuery = "INSERT INTO Students (student_id, f_name, l_name, email) VALUES (0, ?, ?, ?)";

app.post('/api/students', function (req, res, next) {
    var context = {};
    var { f_name, l_name, email } = req.body;
    mysql.pool.query(studentInsertQuery, [f_name, l_name, email], (err, result) => {
        if (err) {
            next(err);
            return;
        }
        res.sendStatus(200);
    }
    );
});

const studentsGetAllQuery = "SELECT student_id, f_name, l_name, email from Students";
const studentUpdateQuery = "UPDATE Students SET email = ? WHERE student_id= ?";

app.put('/api/students', function (req, res, next) {
    var { email, student_id } = req.body;
    mysql.pool.query(studentUpdateQuery,
        [email, student_id],
        (err, result) => {
            if (err) {
                next(err);
                return;
            }
            res.sendStatus(200);
        }
    );
});



app.get('/teachers', (req, res, next) => {
    mysql.pool.query(teachersGetAllQuery, (err, rows, fields) => {
        if (err) {
            next(err);
            return;
        }
        res.render('teachers', { rows: rows });
    });
});

const teachersGetAllQuery = "SELECT teacher_id, f_name, l_name, email from Teachers";
const teacherInsertQuery = "INSERT INTO Teachers (teacher_id, f_name, l_name, email) VALUES (0, ?, ?, ?)";

app.post('/api/teachers', function (req, res, next) {
    var context = {};
    var { f_name, l_name, email } = req.body;
    mysql.pool.query(teacherInsertQuery, [f_name, l_name, email], (err, result) => {
        if (err) {
            next(err);
            return;
        }
        res.sendStatus(200);
    }
    );
});


app.get('/sessions', (req, res, next) => {
    mysql.pool.query(classNameGetAllQuery, (err, rows, fields) => {
        if (err) {
            next(err);
            return;
        }

        var { class_id, quarter } = req.query;
        mysql.pool.query(sessionsFilteredQuery, [class_id === undefined ? -1 : 1, class_id, quarter === undefined ? -1 : 1, quarter], (err2, rows2, fields2) => {
            if (err2) {
                next(err2);
                return;
            }
            mysql.pool.query(teachersGetAllQuery, (err3, rows3, fields3) => {
                if (err3) {
                    next(err3);
                    return;
                }

                mysql.pool.query(sessionsGetAllQuery, (err4, rows4, fields4) => {
                    if (err3) {
                        next(err3);
                        return;
                    }

                    res.render('sessions', { classes: rows, filtered_sessions: rows2, teachers: rows3, sessions: rows4 });
                }
                );

            }
            );
        }
        );
    });
});

const classNameGetAllQuery = "SELECT class_id, class_name FROM Classes";

const sessionsFilteredQuery = "SELECT Classes.class_name, Sessions.quarter, Sessions.session_name, Teachers.f_name, Teachers.l_name, Sessions.quarter, Sessions.session_size\n" +
    "FROM Sessions\n" +
    "INNER JOIN Classes ON Classes.class_id = Sessions.class_id\n" +
    "LEFT JOIN Teachers ON Teachers.teacher_id = Sessions.teacher_id\n" +
    "WHERE (? = -1 OR Sessions.class_id = ?) AND \n" +
    "(? = -1 OR Sessions.quarter = ?)\n" +
    "ORDER BY Sessions.session_id ASC";

const sessionsGetAllQuery = "SELECT Sessions.session_id, Classes.class_name, Sessions.session_name, Sessions.class_id, Sessions.teacher_id, Sessions.quarter, Sessions.session_size FROM Sessions INNER JOIN Classes ON Classes.class_id = Sessions.class_id";

const sessionInsertQuery = "INSERT INTO Sessions (session_id, session_name, quarter, session_size, class_id, teacher_id) VALUES (0, ?, ?, ?, ?, ?)";

app.post('/api/sessions', function (req, res, next) {
    var context = {};
    var { session_name, quarter, session_size, class_id, teacher_id } = req.body;
    mysql.pool.query(sessionInsertQuery, [session_name, quarter, session_size, class_id, teacher_id == "NULL" ? null : teacher_id], (err, result) => {
        if (err) {
            next(err);
            return;
        }
        res.sendStatus(200);
    }
    );
});

const sessionUpdateQuery = "UPDATE Sessions SET teacher_id = ?, session_size = ? WHERE session_id= ?";

app.put('/api/sessions', function (req, res, next) {
    var { teacher_id, session_size, session_id } = req.body;
    mysql.pool.query(sessionUpdateQuery,
        [teacher_id == "NULL" ? null : teacher_id, session_size, session_id],
        (err, result) => {
            if (err) {
                next(err);
                return;
            }
            res.sendStatus(200);
        }
    );
});

const sessionDeleteQuery = "DELETE from Sessions WHERE session_id = ?";

app.delete('/api/sessions', function (req, res, next) {
    var { session_id } = req.body;
    mysql.pool.query(sessionDeleteQuery,
        [session_id],
        (err, result) => {
            if (err) {
                next(err);
                return;
            }
            res.sendStatus(200);
        }
    );
});



app.get('/enrollments', (req, res, next) => {

    var { student_id, session_id } = req.query;

    mysql.pool.query(enrollmentsFilterQuery, [student_id === undefined ? -1 : 1, student_id, session_id === undefined ? -1 : 1, session_id], (err, rows, fields) => {
        if (err) {
            next(err);
            return;
        }

        mysql.pool.query(sessionsGetAllQuery, (err2, rows2, fields2) => {
            if (err2) {
                next(err2);
                return;
            }
            mysql.pool.query(studentsGetAllQuery, (err3, rows3, fields3) => {
                if (err3) {
                    next(err3);
                    return;
                }

                res.render('enrollments', { filtered_enrollments: rows, sessions: rows2, students: rows3 });
            }
            );

        }
        );
    }
    );
});


const enrollmentsFilterQuery = "SELECT Enrollments.enrollment_id, Students.f_name AS student_f_name, Students.l_name AS student_l_name, Students.email, Classes.class_name, Sessions.session_name, Sessions.quarter, Sessions.session_size, Teachers.f_name, Teachers.l_name\n" +
    "FROM Sessions\n" +
    "INNER JOIN Teachers ON Teachers.teacher_id = Sessions.teacher_id\n" +
    "INNER JOIN Enrollments ON Sessions.session_id = Enrollments.session_id\n" +
    "INNER JOIN Students ON Enrollments.student_id = Students.student_id\n" +
    "INNER JOIN Classes ON Classes.class_id = Sessions.class_id " +
    "WHERE (? = -1 OR Students.student_id = ?) AND \n" +
    "(? = -1 OR Sessions.session_id = ?)\n" +
    "ORDER BY Sessions.session_id ASC";

const enrollmentInsertQuery = "INSERT INTO Enrollments (enrollment_id, session_id, student_id) VALUES (0, ?, ?)";

app.post('/api/enrollments', function (req, res, next) {
    var context = {};
    var { session_id, student_id } = req.body;
    mysql.pool.query(enrollmentInsertQuery, [session_id, student_id], (err, result) => {
        if (err) {
            next(err);
            return;
        }
        res.sendStatus(200);
    }
    );
});

const enrollmentDeleteQuery = "DELETE from Enrollments WHERE enrollment_id = ?";

app.delete('/api/enrollments', function (req, res, next) {
    var { enrollment_id } = req.body;
    mysql.pool.query(enrollmentDeleteQuery,
        [enrollment_id],
        (err, result) => {
            if (err) {
                next(err);
                return;
            }
            res.sendStatus(200);
        }
    );
});




app.listen(app.get('port'), () => {
    console.log(`Express started on http://localhost:${app.get('port')}; Ctrl+c to terminate`)
});
