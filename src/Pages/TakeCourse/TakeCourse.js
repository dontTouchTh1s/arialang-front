import {
    Accordion, AccordionDetails,
    AccordionSummary,
    Box,
    Container,
    Divider, Modal,
    Paper,
    Snackbar,
    Stack,
    Typography,
    Alert, Button, styled
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import Api from "../../Api/Api";
import {Link, useLoaderData} from "react-router-dom";
import GradingIcon from "@mui/icons-material/Grading";
import SchoolIcon from "@mui/icons-material/School";
import StairsOutlinedIcon from '@mui/icons-material/StairsOutlined';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import AddCardOutlinedIcon from '@mui/icons-material/AddCardOutlined';
import moment from "moment-jalaali";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LoadingButton from "@mui/lab/LoadingButton";
import {useContext, useState} from "react";
import getCookie from "../../GetCookie/GetCookie";
import Login from "../Auth/Login";
import UserContext from "../../Contexts/UserContext";
import FolderSharedIcon from '@mui/icons-material/FolderShared';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export async function loader({params}) {
    if (!parseInt(params.id))
        throw new Response("bad parameter", {status: 422})
    const response = await Api.get('/course/one/' + params.id);
    const course = response.data.data;
    if (getCookie('AriaLang2')) {

        try {
            const response = await Api.get('/user/courses');
            for (const takenCourse of response.data.data) {
                if (takenCourse.course.id === course.id) {
                    course.owned = true;
                }
            }
        } catch (e) {

        }
    }
    return {course};
}

function TakeCourse({id}) {
    const {course} = useLoaderData();

    // Other
    const [expanded, setExpanded] = useState(true);
    const [takeCourseLoading, setTakeCourseLoading] = useState(false);

    // Snackbar
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarType, setSnackbarType] = useState('error');

    // Modal
    const [loginModalOpen, setLoginModalOpen] = useState(false);


    function handleSnackBarClose(event, reason) {
        if (reason === 'clickaway') {
            return;
        }

        setSnackbarOpen(false);
    }

    async function handleTakeCourse() {
        const data = {
            courseId: course.id,
        };
        if (getCookie('AriaLang2')) {
            try {
                setTakeCourseLoading(true);
                const response = await Api.post('/takeCourse', data);
                setTakeCourseLoading(false);
                if (response.data.status === 200) {
                    setSnackbarOpen(true);
                    setSnackbarType('success')
                    setSnackbarMessage('با موفقیت در دوره عضو شدید.');
                    course.owned = true;
                } else if (response.data.status === 409) {
                    setSnackbarOpen(true);
                    setSnackbarType('info')
                    setSnackbarMessage('شما قبلا در این دوره ثبت نام کرده اید.');
                }
            } catch (e) {
                setTakeCourseLoading(false);
                if (e.response.data.status === 401 || e.response.data.status === 404) {
                    setLoginModalOpen(true);
                }
                setSnackbarOpen(true);
                setSnackbarType('error')
                setSnackbarMessage('در هنگام عضویت در دوره مشکلی پیش آمده است، دوباره تلاش کنید.');
            }
        } else {
            setLoginModalOpen(true);
        }
    }

    async function handleOnLogin() {
        setLoginModalOpen(false);
        await handleTakeCourse();
    }

    return (
        <Box>
            <Typography component="h1" variant="h4" sx={{textAlign: 'center'}}>
                مشخصات دوره
            </Typography>
            <Container disableGutters maxWidth={'md'} sx={{p: {xs: 1, md: 2}}}>
                <Grid container spacing={{xs: 2, md: 3}}>
                    <Grid xs={12} container spacing={{xs: 2, md: 3}}>
                        <Grid xs={12}>
                            <Typography component="h2" variant="h5" sx={{textAlign: 'left'}}>
                                {course.title}
                            </Typography>
                            <Typography component="p" variant="subtitle1" sx={{
                                textAlign: 'left'
                            }}
                                        color={'unImportant.main'}>
                                {'در تاریخ '}
                                <Typography component="span" sx={{unicodeBidi: 'plaintext'}}>
                                    {moment(course.createdAt).format('jYYYY/jMM/jDD')}
                                </Typography>
                            </Typography>
                        </Grid>
                        <Grid xs={12} lg={8}>
                            <Stack spacing={1}>
                                <Paper sx={{
                                    display: 'flex',
                                    gap: 1,
                                    flexDirection: 'column',
                                    p: 2
                                }}>
                                    <Box sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                    }}>
                                        <StairsOutlinedIcon/>
                                        <Typography component="p" variant="body1" sx={{textAlign: 'left'}}>
                                            {'سطح دوره: '}
                                            {course.level}
                                        </Typography>
                                    </Box>
                                    <Box sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',

                                    }}>
                                        <GradingIcon/>
                                        <Typography component="p" variant="body1" sx={{textAlign: 'left'}}>
                                            {'پیش نیاز ها: '}
                                            {course.prerequisite}
                                        </Typography>
                                    </Box>
                                    <Box sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',

                                    }}>
                                        <LanguageOutlinedIcon/>
                                        <Typography component="p" variant="body1" sx={{textAlign: 'left'}}>
                                            {'زبان: '}
                                            {course.language.name}
                                        </Typography>
                                    </Box>
                                </Paper>
                                <Accordion
                                    expanded={expanded}
                                    onChange={() => setExpanded(!expanded)}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon/>}
                                        aria-controls="panel1a-content"
                                        id="panel1a-header">
                                        <Typography component="h3" variant="h6" sx={{textAlign: 'left'}}>
                                            {'توضیحات'}
                                        </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography component="p" variant="body1" sx={{textAlign: 'left'}}>
                                            {course.description}
                                        </Typography>
                                    </AccordionDetails>
                                </Accordion>
                            </Stack>
                        </Grid>
                        <Grid xs={12} lg={4}>
                            <Stack spacing={2}>
                                <Paper sx={{
                                    p: 2
                                }}>
                                    <Stack spacing={2}>
                                        <Box>
                                            <Box sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',

                                            }}>
                                                <SchoolIcon fontSize={'large'}/>
                                                <Typography component="h2" variant="h5" sx={{textAlign: 'left'}}>
                                                    {'درباره مدرس'}
                                                </Typography>
                                            </Box>
                                            <Link to={'/teacher/' + course.teacher.id}>
                                                <Button
                                                    sx={{
                                                        justifyContent: 'space-between',
                                                        '& .MuiButton-endIcon': {ml: 0, mr: 1},

                                                    }}
                                                    size={'large'}
                                                    variant={'text'}
                                                    endIcon={<FolderSharedIcon fontSize={'large'}
                                                                               sx={{fontSize: '30px !important'}}/>}
                                                    fullWidth
                                                    color={'info'}>

                                                    <Typography component="span" variant="h6" sx={{textAlign: 'left'}}>
                                                        {course.teacher.user.fName + ' ' + course.teacher.user.lName}
                                                        <Typography component="span" variant="subtitle1"
                                                                    sx={{textAlign: 'left'}}>
                                                            {' (' + course.teacher.user.alias + ') '}
                                                        </Typography>

                                                    </Typography>
                                                </Button>
                                            </Link>
                                        </Box>

                                        <Divider/>
                                        <Box>
                                            <Typography component="p" variant="h6" sx={{textAlign: 'left'}}>
                                                {'شماره تماس'}
                                            </Typography>
                                            <Typography component="p" variant="body1" sx={{textAlign: 'right'}}>
                                                {course.teacher.user.mobile}
                                            </Typography>
                                        </Box>
                                        <Divider/>

                                        <Box>
                                            <Typography component="p" variant="h6" sx={{textAlign: 'left'}}>
                                                {'روزمه'}
                                            </Typography>
                                            <Typography component="p" variant="body1" sx={{textAlign: 'left'}}>
                                                {course.teacher.resume}
                                            </Typography>
                                        </Box>
                                    </Stack>
                                </Paper>
                                <Paper sx={{
                                    p: 2
                                }}>
                                    <Stack spacing={1}>
                                        <Typography component="p" variant="body1" sx={{textAlign: 'right'}}>
                                            {course.price}
                                            {' تومان'}
                                        </Typography>
                                        <LoadingButton
                                            disabled={course.owned}
                                            fullWidth
                                            loading={takeCourseLoading}
                                            variant={'contained'}
                                            startIcon={<AddCardOutlinedIcon/>}
                                            onClick={handleTakeCourse}
                                        >
                                            {'شرکت در دوره'}
                                        </LoadingButton>
                                    </Stack>
                                </Paper>
                            </Stack>
                        </Grid>
                    </Grid>
                </Grid>
            </Container>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackBarClose}>
                <Alert severity={snackbarType} sx={{width: '100%'}}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
            <Modal

                open={loginModalOpen}
                onClose={() => setLoginModalOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{...style, width: '400px'}}>
                    <Login onLogin={handleOnLogin}/>
                </Box>
            </Modal>
        </Box>
    );
}

export default TakeCourse;