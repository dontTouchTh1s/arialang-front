import {useEffect, useState} from "react";
import Api from "../../Api/Api";
import CourseCard from "./CourseCard";
import {Box, Container, FormControl, InputLabel, MenuItem, Select, TextField, Typography} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import {useLoaderData} from "react-router-dom";
import LoadingButton from "@mui/lab/LoadingButton";

export async function loader({request}) {
    let allCourses = {};
    let languages = {};

    let language = new URL(request.url).searchParams.get('language');

    if (language) {
        let data = {
            languageId: language
        }
        const response = await Api.post('/search/allCourse', data);
        if (response.data.status === 200) {
            allCourses = response.data.data;
        }
    } else {
        language = ''
        try {
            const response = await Api.get('/course/all/' + 10 + '/' + 0);
            if (response.status === 200) {
                if (response.data.status === 200) {
                    allCourses = response.data.data;
                }
            }
        } catch (e) {
        }
    }

    try {
        const response = await Api.get('/languages');
        if (response.data.status === 200) {
            languages = response.data.data;
        }
    } catch (e) {
    }

    return {allCourses, languages, language}
}

function Courses() {
    const [courses, setCourses] = useState(useLoaderData().allCourses);
    const languageIds = useLoaderData().languages;
    const [searchCourseTitle, setSearchCourseTitle] = useState('');
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchCourseLevel, setSearchCourseLevel] = useState('');
    const [searchCourseLanguage, setSearchCourseLanguage] = useState(useLoaderData().language);

    async function handleSearch() {
        try {
            let data = {
                title: searchCourseTitle,
                level: searchCourseLevel,
                languageId: searchCourseLanguage
            }
            setSearchLoading(true);
            const response = await Api.post('/search/allCourse', data);
            setSearchLoading(false);
            if (response.data.status === 200) {
                setCourses(response.data.data);
            }


        } catch (e) {

        }

    }

    useEffect(() => {
    }, [])
    return (
        <>
            <Box>
                <Typography component="h1" variant="h4" sx={{textAlign: 'center'}}>
                    دوره ها
                </Typography>
                <Container disableGutters maxWidth={'md'} sx={{p: {xs: 1, md: 2}}}>
                    <Grid container spacing={{xs: 2, md: 3}}>
                        <Grid xs={12} container spacing={{xs: 2, md: 3}}>
                            <Grid xs={12} sm={6} md={3}>
                                <TextField
                                    fullWidth
                                    label={'جست و جو'}
                                    value={searchCourseTitle}
                                    onChange={(e) => setSearchCourseTitle(e.target.value)}
                                >

                                </TextField>
                            </Grid>
                            <Grid xs={12} sm={6} md={3}>
                                <FormControl fullWidth>
                                    <InputLabel id={'level-label'}>سطح دوره</InputLabel>
                                    <Select
                                        autoWidth
                                        labelId={'level-label'}
                                        value={searchCourseLevel}
                                        onChange={(e) => setSearchCourseLevel(e.target.value)}
                                        label={'سطح دوره'}
                                    >
                                        <MenuItem value={''} selected>همه سطوح</MenuItem>
                                        <MenuItem value={'A1'}>Elementary</MenuItem>
                                        <MenuItem value={'A2'}>Pre-Intermediate</MenuItem>
                                        <MenuItem value={'B1'}>Intermediate</MenuItem>
                                        <MenuItem value={'B2'}>Upper-Intermediate</MenuItem>
                                        <MenuItem value={'C1'}>Advanced</MenuItem>
                                        <MenuItem value={'C2'}>Proficiency</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid xs={12} sm={6} md={3}>
                                <FormControl fullWidth>
                                    <InputLabel id={'language-label'}>زبان</InputLabel>
                                    <Select
                                        autoWidth
                                        labelId={'language-label'}
                                        value={searchCourseLanguage}
                                        onChange={(e) => setSearchCourseLanguage(e.target.value)}
                                        label={'زبان'}
                                    >
                                        <MenuItem value={''} selected>همه زبان ها</MenuItem>
                                        {
                                            languageIds.map(lng =>
                                                <MenuItem key={lng.id} value={lng.id} selected>{lng.name}</MenuItem>
                                            )
                                        }

                                    </Select>
                                </FormControl>
                            </Grid>


                            <Grid xs={12} sm={6} md={3} sx={{
                                display: 'flex',
                                alignItems: 'center'
                            }}>
                                <LoadingButton
                                    variant={'outlined'}
                                    fullWidth
                                    loading={searchLoading}
                                    onClick={handleSearch}
                                >
                                    {'جست و جو'}
                                </LoadingButton>
                            </Grid>
                        </Grid>
                        {
                            courses.length !== 0 ?
                                courses.map(course =>
                                    <Grid key={course.id} xs={12} sm={6} md={4}>
                                        <CourseCard course={course}>
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
            </Box>
        </>
    );
}


export default Courses;