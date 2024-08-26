import { Grid, Stack, Typography, useTheme } from "@mui/material"
import { DashboardContent } from "src/layouts/dashboard";


import { useAuthContext } from "src/auth/hooks";
import { useEffect, useState } from "react";
import axios, { endpoints } from "src/utils/axios";

import { CurrentTask } from "../current-task-chart";
import { AppWidgetSummary } from "../app-widget-summary";
import { WeeklyTaskProgress } from "../weeky-task-progress";
import { CONFIG } from "src/config-global";
import { useSelector } from "react-redux";
import { RootState } from "src/store";

type DashboardData = {
    taskDistribution: object;
    statusCounts: {
        "To Do": number;
        "In Progress": number;
        "In Review": number;
        "Completed": number;
    };
    weeklyTaskProgress: object;
};

export function OverviewAppView() {
    const theme = useTheme();

    // Fetch user data from store
    const email = useSelector(( state: RootState) => state.user.email );

    console.log('User email', email);
    

    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [isDataLoading, setIsDataLoaing] = useState(true);

    // Get logged in user data from user auth context
    const { user } = useAuthContext()

    const fetchData = async () => {
        try {
            const response = await axios.get(endpoints.dashboard);

            const { result } = response.data;

            setDashboardData(result);

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    // fetch dashboard data

    useEffect(() => {
        fetchData();
        setIsDataLoaing(false);
    }, [])

    const dashboardUI = (

        <Grid container spacing={2}>

            <Grid xs={12} sm={3} md={3}>
                <AppWidgetSummary
                    title="To-Do"
                    total={dashboardData?.statusCounts ? dashboardData?.statusCounts?.["To Do"] : 0}
                    icon={
                        <img alt="icon" src={`${CONFIG.site.basePath}/assets/icons/todo/icons8-to-do-50.png`} />
                    }
                />
            </Grid>

            <Grid xs={12} sm={3} md={3}>
                <AppWidgetSummary
                    title="In Progress"
                    total={dashboardData?.statusCounts ? dashboardData?.statusCounts?.["In Progress"] : 0}
                    icon={
                        <img alt="icon" src={`${CONFIG.site.basePath}/assets/icons/todo/icons8-in-progress-50.png`} />
                    }
                />
            </Grid>

            <Grid xs={12} sm={3} md={3}>
                <AppWidgetSummary
                    title="In Review"
                    total={dashboardData?.statusCounts ? dashboardData?.statusCounts?.["In Review"] : 0}
                    icon={
                        <img alt="icon" src={`${CONFIG.site.basePath}/assets/icons/todo/icons8-review-50.png`} />
                    }
                />
            </Grid>

            <Grid xs={12} sm={3} md={3}>
                <AppWidgetSummary
                    title="Completed"
                    total={dashboardData?.statusCounts ? dashboardData?.statusCounts?.Completed : 0}
                    icon={
                        <img alt="icon" src={`${CONFIG.site.basePath}/assets/icons/todo/icons8-microsoft-to-do-app-50.png`} />
                    }
                />
            </Grid>


            {/* Current Task */}
            <Grid xs={12} md={6} lg={4}>
                <CurrentTask
                    title="Current Task Distribution"
                    chartData={dashboardData?.taskDistribution} />
            </Grid>

            {/* Weekly Task Overview */}
            <Grid xs={12} md={6} lg={8}>
                <WeeklyTaskProgress
                    title="Weekly Progress"
                    chartData={dashboardData?.weeklyTaskProgress} />
            </Grid>
        </Grid>
    )

    const renderLoading = (
        <Stack direction="row" alignItems="flex-start" sx={{ gap: 'var(--column-gap)' }} />
    );

    return (
        <DashboardContent maxWidth="xl">

            {/* Welcome Text */}
            <Typography variant="h4" sx={{ mb: { xs: 3, mb: 5 } }}>
                {/* Get user name dynamically */}
                Hi, Welcome Back {user?.displayName ? user?.displayName?.split(' ')[0] : ''}
            </Typography>


            {/* 4 Status Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <AppWidgetSummary
                    title="To-Do"
                    total={dashboardData?.statusCounts?.["To Do"] ?? 0}
                    icon={`${CONFIG.site.basePath}/assets/icons/todo/icons8-microsoft-to-do-app-50.png`}
                />
                <AppWidgetSummary
                    title="In Progress"
                    total={dashboardData?.statusCounts?.["In Progress"] ?? 0}
                    icon={`${CONFIG.site.basePath}/assets/icons/todo/icons8-in-progress-50.png`}
                />
                <AppWidgetSummary
                    title="In Review"
                    total={dashboardData?.statusCounts?.["In Review"] ?? 0}
                    icon={`${CONFIG.site.basePath}/assets/icons/todo/icons8-review-50.png`}
                />
                <AppWidgetSummary
                    title="Completed"
                    total={dashboardData?.statusCounts?.Completed ?? 0}
                    icon={`${CONFIG.site.basePath}/assets/icons/todo/icons8-microsoft-to-do-app-50.png`}

                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mt-4">
                {/* Second row with 2 cards */}
                <div className="bg-white rounded-lg p-0">
                <CurrentTask
                    title="Current Task Distribution"
                    chartData={dashboardData?.taskDistribution} />
                </div>
                <div className="bg-white shadow-lg rounded-lg p-6">
                <WeeklyTaskProgress
                    title="Weekly Progress"
                    chartData={dashboardData?.weeklyTaskProgress} />
                </div>
            </div>



            {/* To-Do , In Progress, In Progress, Completed Counts */}
            {/* { isDataLoading ? renderLoading: dashboardUI} */}


        </DashboardContent>
    );
}