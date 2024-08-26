const { catchErrors } = require("../handlers/errorHandlers");
const { successResponse } = require("../handlers/successHandler");

const UserTask = require("../models/UserTasksModel");

const CreateTaskSchema = require("../schemas/createTaskSchema");

// Create Task
const createTask = async (req, res) => {
    try {

        const validate = CreateTaskSchema.validate(req.body)
        if (validate?.error) {
            catchErrors(res, 'Bad Request', validate?.error?.details[0].message)
        }

        const { id } = req.user;

        const { name, priority, status } = req.body;

        const data = {
            name,
            created_by: id
        }

        if (priority) {
            data['priority'] = priority;
        }

        if (status) {
            data['status'] = status;
        }

        // create task
        await UserTask.create(data)

        successResponse(res, 201, {}, "Task Created Successfully");

    } catch (error) {
        catchErrors(res, null, "Something Went Wrong", error)
    }
}

// Read Tsk
const readTask = async (req, res) => {
    try {
        const { id: userId } = req.user;

        const tasks = await UserTask.findAll({
            attributes: ['id', 'name', 'status', 'priority'],
            where: {
                created_by: userId,
                is_deleted: 0
            },
            raw: true
        })

        let resObj = {
            "board": {
                "tasks": formatKanbanResponse(tasks),
                "columns": [{
                    "id": 1,
                    "name": "To Do"
                },
                {
                    "id": 2,
                    "name": "In Progress"
                }, {
                    "id": 3,
                    "name": "In Review"
                }, {
                    "id": 4,
                    "name": "Completed"
                },
                ]
            }
        }
        successResponse(res, 200, resObj, "Tasks fetched successfully");
    } catch (error) {
        catchErrors(res, null, "Something Went Wrong", error)
    }
}
// Updte Task
const updateTask = async (req, res) => {
    try {

        const { taskId } = req.params;
        const { id: userId } = req.user;

        await UserTask.update(
            req.body,
            {
                where: {
                    id: taskId,
                    created_by: userId
                },
            },
        );

        successResponse(res, 200, {}, "Task Updated successfully");
    } catch (error) {
        catchErrors(res, null, "Something Went Wrong", error)
    }
}
// Delete Task
const deleteTask = async (req, res) => {
    try {

        const { taskId } = req.params;

        await UserTask.update(
            {
                is_deleted: 1
            },
            {
                where: {
                    id: taskId,
                },
            },
        );

        successResponse(res, 200, {}, "Task Deleted successfully");
    } catch (error) {
        catchErrors(res, null, "Something Went Wrong", error)
    }
}

function formatKanbanResponse(tasks = []) {
    let finalObj = {
        "1": [],
        "2": [],
        "3": [],
        "4": []
    }

    tasks.forEach((task) => {
        if (task.status === "To Do") {
            finalObj["1"].push(task)
        } else if (task.status === "In Progress") {
            finalObj["2"].push(task)
        } else if (task.status === "In Review") {
            finalObj["3"].push(task)
        } else {
            finalObj["4"].push(task)
        }
    })

    return finalObj
}

module.exports = {
    createTask,
    readTask,
    updateTask,
    deleteTask
}