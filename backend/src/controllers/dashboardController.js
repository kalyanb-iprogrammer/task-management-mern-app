const { catchErrors } = require("../handlers/errorHandlers")
const { successResponse } = require("../handlers/successHandler");

const { sequelize, QueryTypes } = require("../utils/database/connection");

const fetchTasksData = async (req, res) => {
    try {
        const {id: userId } = req.user;

        let whereCondition = `WHERE 
                                    created_at >= DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY)
                                    AND created_at < DATE_ADD(DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY), INTERVAL 7 DAY)
                                    AND created_by = ${userId} AND is_deleted = 0`;

        const allStatusCountQuery = `SELECT 
                                    status,
                                    COUNT(*) AS count
                                FROM 
                                    user_tasks
                                ${whereCondition}
                                GROUP BY 
                                    status`;
        
        const weekProgressQuery = `SELECT 
                                    DAYNAME(created_at) AS day,
                                    status,
                                    COUNT(*) AS count
                                FROM 
                                    user_tasks
                                ${whereCondition}
                                GROUP BY 
                                    DAYNAME(created_at), status
                                ORDER BY 
                                    DAYOFWEEK(created_at), status`


        const userTasksPromise = await sequelize.query(allStatusCountQuery, {
            type: QueryTypes.SELECT
        });


        const weeklyTaskPromise = sequelize.query(weekProgressQuery, {
            type: QueryTypes.SELECT
        });

        const [userTasks, weeklyTasks] = await Promise.all([userTasksPromise, weeklyTaskPromise]);

        let statusLabels = [];
        let statusData = [];
        let statusCounts = {}
        
        let weeklyTaskProgress = {
            toDo: [0, 0, 0, 0, 0, 0, 0],
            inProgress: [0, 0, 0, 0, 0, 0, 0],
            inReview: [0, 0, 0, 0, 0, 0, 0],
            completed:  [0, 0, 0, 0, 0, 0, 0]
        }

        userTasks.forEach((type) => {
            statusLabels.push(type.status);
            statusData.push(type.count);
            statusCounts[type.status] = type.count
        })

        let resObj = {
            taskDistribution :{
                labels: statusLabels,
                data: statusData
            },
            statusCounts,
            weeklyTaskProgress : formatWeeklyProgressData(weeklyTasks, weeklyTaskProgress)
        }
        
        successResponse(res, 200, resObj, "Data fetched successfully");

    } catch (error) {
        catchErrors(res, null, "Something Went Wrong", error)
    }
}

function formatWeeklyProgressData(data = [], weeklyTaskProgress) {

    let dayAndIndexMapping = {
        'Monday' : 0,
        'Tuesday' : 1,
        'Wednesday' : 2,
        'Thursday' : 3,
        'Friday' : 4,
        'Saturday' : 5,
        'Sunday' : 6
    }
    if (data.length > 1) {
        data.forEach((e) => {
            if (e.status === 'To Do') {
                weeklyTaskProgress['toDo'][dayAndIndexMapping[e.day]] = e.count;
            } else if(e.status === 'In Progress'){
                weeklyTaskProgress['inProgress'][dayAndIndexMapping[e.day]] = e.count;
            } else if(e.status === 'In Review') {
                weeklyTaskProgress['inReview'][dayAndIndexMapping[e.day]] = e.count;
            } else {
                // Completed
                weeklyTaskProgress['completed'][dayAndIndexMapping[e.day]] = e.count;
            }
        })

        return weeklyTaskProgress;
    } else {
        return weeklyTaskProgress;
    }
}

module.exports = {
    fetchTasksData
}