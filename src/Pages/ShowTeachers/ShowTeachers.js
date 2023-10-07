import {useLoaderData} from "react-router-dom";
import Api from "../../Api/Api";
import {Box, Container, TextField, Typography} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import CourseCard from "../Courses/CourseCard";
import TeacherCard from "./TeacherCard";
import {useState} from "react";

export async function loader() {
    const response = await Api.get('/teachers');
    const allTeachers = response.data.data;
    return {allTeachers};
}

function ShowTeachers() {
    const {allTeachers} = useLoaderData();

    const [teachers, setTeachers] = useState(allTeachers);
    const [search, setSearch] = useState('');

    function handleSearch(value) {
        setSearch(value);
        const regex = new RegExp(value, 'i');
        setTeachers(allTeachers.filter(teacher => regex.test(teacher.user.fName + ' ' + teacher.user.lName)));
    }

    console.log(teachers)
    return (
        <Box>
            <Typography component="h1" variant="h4" sx={{textAlign: 'center'}}>
                مدرس ها
            </Typography>
            <Container disableGutters maxWidth={'md'} sx={{p: {xs: 1, md: 2}}}>
                <Grid container spacing={{xs: 2, md: 3}}>
                    <Grid xs={12} container justifyContent={'center'}>
                        <Grid xs={10} sm={7} md={6}>
                            <TextField
                                fullWidth
                                value={search}
                                label={'جست و جو'}
                                onChange={(e) => handleSearch(e.target.value)}>
                            </TextField>
                        </Grid>
                    </Grid>
                    {
                        teachers.length !== 0 ?
                            teachers.map(teacher =>
                                <Grid key={teacher.id} xs={12} sm={6} md={4}>
                                    <TeacherCard teacher={teacher}>
                                    </TeacherCard>
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

export default ShowTeachers;