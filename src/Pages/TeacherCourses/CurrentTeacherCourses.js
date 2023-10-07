import {useLoaderData} from "react-router-dom";
import Api from "../../Api/Api";
import {Box, Container, Typography} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import CourseCard from "../Courses/CourseCard";

export async function loader() {
    const response = await Api.get('/user/teacher/courses');
    const teacherCourses = response.data.data;
    return {teacherCourses};
}

function CurrentTeacherCourses() {
    const {teacherCourses} = useLoaderData();
    return (
        <Box>
            <Typography component="h1" variant="h4" sx={{textAlign: 'center'}}>
                دوره های ایجاد شده
            </Typography>
            <Container disableGutters maxWidth={'md'} sx={{p: {xs: 1, md: 2}}}>
                <Grid container spacing={{xs: 2, md: 3}}>
                    {
                        teacherCourses.length !== 0 ?
                            teacherCourses.map(teacherCourses =>
                                <Grid key={teacherCourses.id} xs={12} sm={6} md={4}>
                                    <CourseCard course={teacherCourses}>
                                    </CourseCard>
                                </Grid>
                            ) :
                            <Grid xs={12} sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '400px'
                            }}>
                                <Typography component={'p'} variant={'h6'} color={'unImportant.main'}>
                                    {'موردی یافت نشد!'}
                                </Typography>
                            </Grid>
                    }

                </Grid>
            </Container>
        </Box>);
}

export default CurrentTeacherCourses;