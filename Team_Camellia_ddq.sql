-- Team Camellia: Denise Suter, Qin Zan
-- Data Definition Queries & Sample Data

-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jul 26, 2020 at 11:23 PM
-- Server version: 10.4.13-MariaDB-log
-- PHP Version: 7.4.7

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;


-- --------------------------------------------------------

--
-- Table structure for table `Classes`
--

DROP TABLE IF EXISTS `Classes`;
CREATE TABLE `Classes` (
  `class_id` int(11) NOT NULL,
  `class_name` varchar(255) NOT NULL,
  `class_description` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Classes`
--

INSERT INTO `Classes` (`class_id`, `class_name`, `class_description`) VALUES
(1, 'Sculpture: Beginners', 'Learn the basic skills and the history of sculpting in the world of art. \r\nIf you have an interest in learning different sculpting techniques and how to work with different mediums, then sign up for \r\nthis class.'),
(2, 'Sculpture: Advanced', 'Learn advanced sculpting techniques working with complex and difficult mediums. You will\r\nwork with wood, metal and stone mediums. If you are interested in further expanding your skills, then sign up for this class.'),
(3, 'Painting: Beginners', 'Learn the basic skills and the history of acrylic panting in the world of art. If you have an \r\ninterest in learning different painting techniques, implementing different brush styles and different methods to acrylics, \r\nthen sign up for this class.'),
(4, 'Painting: Advanced', 'Learn advanced oil painting techniques and the history of oil panting in the world of art. Learn how to \r\nuse advanced painting techniques, implement different brush styles and methods using oil paints. Sign up for this class to learn \r\nmore.'),
(5, 'Digital Art: Beginners', 'Learn the basic skills and the history of digital graphics in the world of art. If you are interested in learning different \r\nphoto editing and graphic design techniques and using different computer programs to create art, then sign up for this class.'),
(6, 'Digital Art: Advanced', 'Learn the more advanced techniques utilizng graphic design programs and create portfolio level pieces. \r\n If you have an interest in learning how to manipulate graph design programs to complete more challenging projects, then sign up for \r\n this class.');

-- --------------------------------------------------------

--
-- Table structure for table `Class_Times`
--

DROP TABLE IF EXISTS `Class_Times`;
CREATE TABLE `Class_Times` (
  `class_time_id` int(11) NOT NULL,
  `day` int(11) NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `location_id` int(11) DEFAULT NULL,
  `session_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Class_Times`
--

INSERT INTO `Class_Times` (`class_time_id`, `day`, `start_time`, `end_time`, `location_id`, `session_id`) VALUES
(7, 0, '09:00:00', '11:00:00', 1, 1),
(8, 0, '11:00:00', '13:00:00', 1, 1),
(9, 1, '11:00:00', '13:00:00', 2, 1),
(10, 2, '15:00:00', '17:00:00', 3, 1),
(11, 3, '09:00:00', '11:00:00', 4, 1),
(12, 4, '11:00:00', '13:00:00', 5, 1);

-- --------------------------------------------------------

--
-- Table structure for table `Enrollments`
--

DROP TABLE IF EXISTS `Enrollments`;
CREATE TABLE `Enrollments` (
  `enrollment_id` int(11) NOT NULL,
  `session_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Enrollments`
--

INSERT INTO `Enrollments` (`enrollment_id`, `session_id`, `student_id`) VALUES
(1, 1, 2),
(2, 4, 2),
(3, 7, 2),
(4, 2, 1),
(5, 5, 1),
(6, 3, 3),
(7, 6, 3),
(8, 8, 4),
(9, 3, 4),
(10, 5, 4);

-- --------------------------------------------------------

--
-- Table structure for table `Locations`
--

DROP TABLE IF EXISTS `Locations`;
CREATE TABLE `Locations` (
  `location_id` int(11) NOT NULL,
  `location_name` varchar(255) NOT NULL,
  `indoor` tinyint(1) NOT NULL,
  `capacity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Locations`
--

INSERT INTO `Locations` (`location_id`, `location_name`, `indoor`, `capacity`) VALUES
(1, 'Room 101', 1, 30),
(2, 'Room 201', 1, 30),
(3, 'Room 301', 1, 30),
(4, 'Room 111', 1, 40),
(5, 'Rose Garden', 0, 20),
(6, 'Workshop 1', 0, 50),
(7, 'Workshop 2', 0, 50);

-- --------------------------------------------------------

--
-- Table structure for table `Sessions`
--

DROP TABLE IF EXISTS `Sessions`;
CREATE TABLE `Sessions` (
  `session_id` int(11) NOT NULL,
  `session_name` varchar(255) NOT NULL,
  `quarter` int(11) NOT NULL,
  `session_size` int(11) NOT NULL,
  `class_id` int(11) NOT NULL,
  `teacher_id` int(11)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Sessions`
--

INSERT INTO `Sessions` (`session_id`, `session_name`, `quarter`, `session_size`, `class_id`, `teacher_id`) VALUES
(1, 'a', 20203, 30, 1, 1),
(2, 'b', 20203, 30, 1, 2),
(3, 'a', 20204, 30, 2, 1),
(4, 'a', 20203, 30, 3, 3),
(5, 'b', 20203, 30, 3, NULL),
(6, 'a', 20204, 30, 4, 2),
(7, 'a', 20203, 30, 5, 4),
(8, 'a', 20204, 30, 6, 4);

-- --------------------------------------------------------

--
-- Table structure for table `Students`
--

DROP TABLE IF EXISTS `Students`;
CREATE TABLE `Students` (
  `student_id` int(11) NOT NULL,
  `f_name` varchar(255) NOT NULL,
  `l_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Students`
--

INSERT INTO `Students` (`student_id`, `f_name`, `l_name`, `email`) VALUES
(1, 'Anna', 'Cole', 'acole@gm.com'),
(2, 'Fred', 'Richards', 'frichards@gm.com'),
(3, 'Peter', 'Smith', 'psmith@htm.com'),
(4, 'Sally', 'Jones', 'sally345@gm.com');

-- --------------------------------------------------------

--
-- Table structure for table `Teachers`
--

DROP TABLE IF EXISTS `Teachers`;
CREATE TABLE `Teachers` (
  `teacher_id` int(11) NOT NULL,
  `f_name` varchar(255) NOT NULL,
  `l_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Teachers`
--

INSERT INTO `Teachers` (`teacher_id`, `f_name`, `l_name`, `email`) VALUES
(1, 'Alan', 'Lumumba', 'alumumba@camellia.com'),
(2, 'David', 'Johnson', 'djohnson@camellia.com'),
(3, 'Jasmine', 'Lee', 'jlee@camellia.com'),
(4, 'Sheryl', 'Sanchez', 'ssanchez@camellia.com');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Classes`
--
ALTER TABLE `Classes`
  ADD PRIMARY KEY (`class_id`);

--
-- Indexes for table `Class_Times`
--
ALTER TABLE `Class_Times`
  ADD PRIMARY KEY (`class_time_id`),
  ADD UNIQUE KEY `class_time_id` (`class_time_id`),
  ADD KEY `location_id` (`location_id`),
  ADD KEY `session_id` (`session_id`);

--
-- Indexes for table `Enrollments`
--
ALTER TABLE `Enrollments`
  ADD PRIMARY KEY (`enrollment_id`),
  ADD UNIQUE KEY `enrollment_id` (`enrollment_id`),
  ADD KEY `session_id` (`session_id`),
  ADD KEY `student_id` (`student_id`);

--
-- Indexes for table `Locations`
--
ALTER TABLE `Locations`
  ADD PRIMARY KEY (`location_id`),
  ADD UNIQUE KEY `location_id` (`location_id`);

--
-- Indexes for table `Sessions`
--
ALTER TABLE `Sessions`
  ADD PRIMARY KEY (`session_id`),
  ADD UNIQUE KEY `session_id` (`session_id`),
  ADD KEY `class_id` (`class_id`),
  ADD KEY `teacher_id` (`teacher_id`);

--
-- Indexes for table `Students`
--
ALTER TABLE `Students`
  ADD PRIMARY KEY (`student_id`);

--
-- Indexes for table `Teachers`
--
ALTER TABLE `Teachers`
  ADD PRIMARY KEY (`teacher_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Classes`
--
ALTER TABLE `Classes`
  MODIFY `class_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `Class_Times`
--
ALTER TABLE `Class_Times`
  MODIFY `class_time_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `Enrollments`
--
ALTER TABLE `Enrollments`
  MODIFY `enrollment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `Locations`
--
ALTER TABLE `Locations`
  MODIFY `location_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `Sessions`
--
ALTER TABLE `Sessions`
  MODIFY `session_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `Students`
--
ALTER TABLE `Students`
  MODIFY `student_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `Teachers`
--
ALTER TABLE `Teachers`
  MODIFY `teacher_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Class_Times`
--
ALTER TABLE `Class_Times`
  ADD CONSTRAINT `Class_Times_ibfk_1` FOREIGN KEY (`location_id`) REFERENCES `Locations` (`location_id`),
  ADD CONSTRAINT `Class_Times_ibfk_2` FOREIGN KEY (`session_id`) REFERENCES `Sessions` (`session_id`) ON DELETE CASCADE;

--
-- Constraints for table `Enrollments`
--
ALTER TABLE `Enrollments`
  ADD CONSTRAINT `Enrollments_ibfk_1` FOREIGN KEY (`session_id`) REFERENCES `Sessions` (`session_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `Enrollments_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `Students` (`student_id`);

--
-- Constraints for table `Sessions`
--
ALTER TABLE `Sessions`
  ADD CONSTRAINT `Sessions_ibfk_1` FOREIGN KEY (`class_id`) REFERENCES `Classes` (`class_id`),
  ADD CONSTRAINT `Sessions_ibfk_2` FOREIGN KEY (`teacher_id`) REFERENCES `Teachers` (`teacher_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
