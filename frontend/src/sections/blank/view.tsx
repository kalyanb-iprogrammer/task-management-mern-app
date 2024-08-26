import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';
import { Grid } from '@mui/material';

// ----------------------------------------------------------------------

type Props = {
  title?: string;
};

export function BlankView({ title = 'Blank' }: Props) {
  return (
    <DashboardContent maxWidth="xl">
      {/* Welcome Text */}
      <Typography variant="h4"> {title} </Typography>

      {/* To-Do , In Progress, Completed Counts */}
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>


        </Grid>

      </Grid>
    </DashboardContent>
  );
}
