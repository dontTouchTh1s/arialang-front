import {useNavigate} from "react-router-dom";
import Api from "../../Api/Api";
import {
    Box, Checkbox,
    Container, FormControl,
    FormControlLabel, FormHelperText,
    IconButton,
    InputAdornment, InputLabel, MenuItem, Select,
    Snackbar,
    TextField,
    Typography
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import LoadingButton from "@mui/lab/LoadingButton";
import {Alert} from "@mui/lab";
import {useContext, useEffect, useState} from "react";
import userContext from "../../Contexts/UserContext";

function CreateTeacher() {
    // Form inputs
    const [languageId, setLanguageId] = useState([]);
    const [resume, setResume] = useState('');
    const [mobile, setMobile] = useState('');
    // Error handling
    const [resumeError, setResumeError] = useState('');
    const [mobileError, setMobileError] = useState('');

    // Other
    const [loginLoading, setLoginLoading] = useState(false);
    const [languageIds, setLanguageIds] = useState([]);
    // Snackbar
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarType, setSnackbarType] = useState('error');

    useEffect(() => {
        let ignore = false;
        if (!ignore)
            fetchLanguages();

        return () => {
            ignore = true;
        }
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();
        if (handleFormError())
            return;

        let data = {
            resume: resume,
            languageId: languageId,
            mobile: mobile
        };

        try {
            setLoginLoading(true);
            const response = await Api.post('/teacher/create', data);
            setLoginLoading(false);
            if (response.status === 200) {
                if (response.data.status === 200) {
                    setSnackbarType('success');
                    setSnackbarOpen(true);
                    setSnackbarMessage('ثبت نام شما با موفقیت انجام شد، ازین پس میتوانید دوره های آموزشی ایجاد کنید.');
                } else {
                    setSnackbarType('error');
                    setSnackbarOpen(true);
                    setSnackbarMessage(response.data.msg);
                }
            }
        } catch (error) {
            setSnackbarType('error');
            setLoginLoading(false);
            setSnackbarOpen(true);
            setSnackbarMessage('در هنگام دریافت اطلاعات مشکلی پیش آمده است.');
        }
    }

    async function fetchLanguages() {
        try {
            const response = await Api.get('/languages');
            setLanguageIds(response.data.data);
        } catch (e) {

        }
    }

    function handleFormError() {

        let error = false;
        if (handleResumeError(resume)) error = true;
        if (handleMobileError(mobile)) error = true;


        return error;
    }

    function handleResumeError(value) {
        if (value.length < 3) {
            setResumeError('لطفا حداقل 10 کاراکتر وارد کنید.');
            return true;
        } else {
            setResumeError('');
            return false;
        }
    }

    function handleMobileError(value) {
        const regex = new RegExp('^(\\+98|0)?9\\d{9}$');
        if (regex.test(value)) {
            setMobileError('');
            return false;
        } else {
            setMobileError('لطفا شماره موبایل معتبر وارد کنید.');
            return true;
        }
    }

    function handleSnackBarClose(event, reason) {
        if (reason === 'clickaway') {
            return;
        }

        setSnackbarOpen(false);
    }

    return (
        <Box>
            <Typography component="h1" variant="h4" sx={{textAlign: 'center'}}>
                ثبت نام
            </Typography>
            <Container disableGutters maxWidth={'md'} sx={{p: {xs: 1, md: 2}}}>
                <Grid container spacing={{xs: 2, md: 3}}>
                    <Grid xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel id={'language-label'}>زبان مدرس</InputLabel>
                            <Select
                                autoWidth
                                multiple
                                labelId={'language-label'}
                                value={languageId}
                                onChange={(e) => setLanguageId(e.target.value)}
                                label={'زبان مدرس'}
                                required
                            >
                                {
                                    languageIds.map(lng =>
                                        <MenuItem key={lng.id} value={lng.id} selected>{lng.name}</MenuItem>
                                    )
                                }
                            </Select>
                            <FormHelperText>{'می توانید چند زبان انتخاب کنید.'}</FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid xs={12} sm={6}>
                        <TextField
                            onBlur={(e) => handleMobileError(e.target.value)}
                            error={mobileError !== ''}
                            helperText={mobileError}
                            required
                            fullWidth
                            label="شماره تماس"
                            type={'tel'}
                            value={mobile}
                            onChange={(e) => {
                                setMobile(e.target.value);
                                handleMobileError(e.target.value);
                            }}
                        />
                    </Grid>
                    <Grid xs={12}>
                        <TextField
                            fullWidth
                            onBlur={(e) => handleResumeError(e.target.value)}
                            error={resumeError !== ''}
                            helperText={resumeError}
                            placeholder={'رزومه'}
                            label={'رزومه'}
                            multiline
                            value={resume}
                            onChange={(e) => {
                                setResume(e.target.value);
                                handleResumeError(e.target.value);
                            }}
                            minRows={4}
                            maxRows={5}
                            required
                        >
                        </TextField>
                    </Grid>
                    <Grid xs={12} sm={5} md={3}>
                        <LoadingButton
                            loading={loginLoading}
                            type="submit"
                            variant="contained"
                            fullWidth
                            onClick={handleSubmit}
                        >
                            <span>
                            ثبت نام
                            </span>
                        </LoadingButton>
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
        </Box>
    );
}

export default CreateTeacher;