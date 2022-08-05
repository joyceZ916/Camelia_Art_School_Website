-- CS 340 
-- Group 2: Denise Suter, Qin Zan
-- These the Database Manipulation queries for our Project Website using the Camellia Art School database.


-- Classes page
-- add a new class to Classes table:
INSERT INTO Classes
        (class_name, class_description)
VALUES
        (:class_nameInput, :class_descriptionInput)

-- get all classes from Classes to display to user (also used for dropdown elements):
SELECT DISTINCT class_name, class_description
FROM Classes
ORDER BY class_name ASC


-- Locations page
-- get all locations to pre-populate table when first rendered from Locations table:
SELECT *
FROM Locations
ORDER BY location_name ASC

-- gets data to pre-populate form elements from Locations table:
SELECT DISTINCT capacity
FROM Locations
ORDER BY capacity ASC

-- add a new location to Locations table: 
INSERT INTO Locations
        (location_name, indoor, capacity)
VALUES
        (:location_nameInput, :indoorInput, :capacityInput)

-- get all locations from search form criteria from Locations table:
SELECT *
FROM Locations
WHERE  indoor = (:indoorInput) AND capacity = (:capacityInput)
ORDER BY location_name ASC



-- Class Times page
-- get all class times from Class_Times table to pre-populate table when page first rendered:
SELECT DISTINCT l.location_name, c.class_time_id, c.day, c.start_time, c.end_time, s.teacher_id, cl.class_name, s.quarter, s.session_name,
        CONCAT_WS(" ", t.f_name, t.l_name) as full_name
FROM Class_Times c
        LEFT JOIN Sessions s ON c.session_id = s.session_id
        LEFT JOIN Teachers t ON s.teacher_id = t.teacher_id
        LEFT JOIN Locations l ON c.location_id = l.location_id
        LEFT JOIN Classes cl ON cl.class_id = s.class_id
ORDER BY c.day, c.start_time ASC

-- get all locations data from Locations table to pre-populate dropdown for Class Times search form:
SELECT location_id, location_name
FROM Locations

-- get all sessions data to from Sessions table pre-populate dropdown for Class Times search form:
SELECT Sessions.session_id, Classes.class_name, Sessions.quarter, Sessions.session_name
FROM Sessions INNER JOIN Classes on Classes.class_id = Sessions.class_id

-- query to ensure new class time has 0 overlap with existing class times in Class_Times table:
SELECT *
FROM Class_Times
WHERE day = (:dayInput) AND location_id = (:location_idInput) AND
        ((start_time BETWEEN (SELECT STR_TO_DATE((:start_timeInput),"%h%i%s")) AND (SELECT STR_TO_DATE((:end_timeInput),"%h%i%s"))) OR
        (end_time BETWEEN (SELECT STR_TO_DATE((:start_timeInput),"%h%i%s")) AND (SELECT STR_TO_DATE((:end_timeInput),"%h%i%s"))) OR
        ((SELECT STR_TO_DATE((:start_timeInput),"%h%i%s")) BETWEEN start_time AND end_time))

-- add a new class time to Class_Times table:
INSERT INTO Class_Times
        (day, start_time, end_time, location_id, session_id)
VALUES
        (:dayInput, :start_timeInput, :end_timeInput, :location_idInput, :session_idInput)


-- get all class times from Class_Times table to display search form results:
SELECT l.location_name, c.class_time_id, c.day, c.start_time, c.end_time, s.teacher_id, cl.class_name, s.quarter, s.session_name,
        CONCAT_WS(" ", t.f_name, t.l_name) as full_name
FROM Class_Times c
        LEFT JOIN Sessions s ON c.session_id = s.session_id
        LEFT JOIN Teachers t ON s.teacher_id = t.teacher_id
        LEFT JOIN Locations l ON c.location_id = l.location_id
        LEFT JOIN Classes cl ON cl.class_id = s.class_id
WHERE c.session_id = (:session_id_form) AND c.location_id = (:location_id_form) AND day = (:day_form)
ORDER BY c.start_time ASC

-- deletes a row from Class_Times table: 
DELETE FROM Class_Times WHERE class_time_id = (:class_time_idInput)



-- Students page

-- get all students from Students table to display to user:
SELECT student_id, f_name, l_name, email
from Students

-- add a new student to Students table:
INSERT INTO Students
        (student_id, f_name, l_name, email)
VALUES
        (0, :f_nameInput, :l_nameInput, :emailInput)

-- update student's email in Students table:
UPDATE Students SET email = (:emailInput) WHERE student_id= (:student_idInput)



-- Teachers page

-- get all teachers from Teachers table to display to user:
SELECT teacher_id, f_name, l_name, email
from Teachers

-- add a new teacher to Teachers table:
INSERT INTO Teachers
        (teacher_id, f_name, l_name, email)
VALUES
        (0, (:teacherIdInput), (:first_nameInput), (:last_nameInput))



-- Sessions page

-- get all sessions data from Sessions and Classes table:
SELECT Sessions.session_id, Classes.class_name, Sessions.session_name, Sessions.class_id, Sessions.teacher_id, Sessions.quarter, Sessions.session_size
FROM Sessions INNER JOIN Classes ON Classes.class_id = Sessions.class_id

-- get all class names from Classes table to pre-populate dropdown for Sessions search form:
SELECT class_id, class_name
FROM Classes

-- get all or filtered sessions from Sessions, Classes and Teachers table to display to user:
SELECT Classes.class_name, Sessions.quarter, Sessions.session_name, Teachers.f_name, Teachers.l_name, Sessions.quarter, Sessions.session_size
FROM Sessions
        INNER JOIN Classes ON Classes.class_id = Sessions.class_id
        LEFT JOIN Teachers ON Teachers.teacher_id = Sessions.teacher_id
WHERE (:class_idInput = -1 OR Sessions.class_id = :class_idInput) AND
        (:quarterInput = -1 OR Sessions.quarter = :quarterInput)
ORDER BY Sessions.session_id ASC
-- Note: the two -1 checks above are used to bypass the search term. In the case the user does not search on this field, a -1 is supplied to this query.

-- add a new session to Sessions table:
INSERT INTO Sessions
        (session_id, session_name, quarter, session_size, class_id, teacher_id)
VALUES
        (0, :session_nameInput, :quarterInput, :session_sizeInput, :class_idInput, :teacher_idInput)

-- update a session in Sessions table:
UPDATE Sessions SET teacher_id = :teacher_idInput, session_size = :session_sizeInput WHERE session_id= :session_idInput

-- delete a session in Sessions table:
DELETE from Sessions WHERE session_id = :session_idInput



-- Enrollments page

-- get all or filtered enrollments from Enrollments table to display to user:
SELECT Enrollments.enrollment_id, Students.f_name AS student_f_name, Students.l_name AS student_l_name, Students.email, Classes.class_name, Sessions.session_name, Sessions.quarter, Sessions.session_size, Teachers.f_name, Teachers.l_name
FROM Sessions
        INNER JOIN Teachers ON Teachers.teacher_id = Sessions.teacher_id
        INNER JOIN Enrollments ON Sessions.session_id = Enrollments.session_id
        INNER JOIN Students ON Enrollments.student_id = Students.student_id
        INNER JOIN Classes ON Classes.class_id = Sessions.class_id
WHERE (:student_idInput = -1 OR Students.student_id = :student_idInput) AND
        (:session_idInput = -1 OR Sessions.session_id = :session_idInput)
ORDER BY Sessions.session_id DESC
-- Note: the two -1 checks above are used to bypass the search term. In the case the user does not search on this field, a -1 is supplied to this query.

-- add a new enrollment to Enrollments table:
INSERT INTO Enrollments
        (enrollment_id, session_id, student_id)
VALUES
        (0, :session_idInput, :student_idInput)

-- delete an enrollment from Enrollments table:
DELETE from Enrollments WHERE enrollment_id = :enrollment_idInput
