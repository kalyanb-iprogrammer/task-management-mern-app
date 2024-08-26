const express = require('express');

const router = express.Router();

const passport = require('../../config/passport');

// Get all controllers
const adminController = require('../../controllers/adminController');
const dashboardController = require('../../controllers/dashboardController');
const userController = require('../../controllers/userController');
const taskController = require('../../controllers/taskController');

// App routes

// Authentication routes
router.route('/auth/sign-up').post(adminController.SignUp);
router.route('/auth/sign-in').post(adminController.Login);

router.route('/auth/me').get(passport.authenticate('jwt', { session: false }), userController.UserDetails);

// Dashbord API
router.route('/dashboard').get(passport.authenticate('jwt', { session: false }), dashboardController.fetchTasksData);

// Kanban API
router.route('/kanban').get(passport.authenticate('jwt', { session: false }), taskController.readTask);

// Tasks CRUD APIs
router.route('/task/create').post(passport.authenticate('jwt', { session: false }), taskController.createTask);
router.route('/task/update/:taskId').patch(passport.authenticate('jwt', { session: false }), taskController.updateTask);
router.route('/task/delete/:taskId').delete(passport.authenticate('jwt', { session: false }), taskController.deleteTask);

module.exports = router;