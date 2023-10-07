import {
    Alert, Box,
    Checkbox,
    Container, FormControl,
    FormControlLabel,
    IconButton,
    InputAdornment, InputLabel, MenuItem, Select,
    Snackbar,
    TextField,
    Typography
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import LoadingButton from "@mui/lab/LoadingButton";
import {useContext, useEffect, useState} from "react";
import Api from "../../Api/Api";
import userContext from "../../Contexts/UserContext";
import UserContext from "../../Contexts/UserContext";


function CreateCourse() {
    // Inputs
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState(0);
    const [level, setLevel] = useState('');
    const [description, setDescription] = useState('');
    const [languageId, setLanguageId] = useState('');
    const [prerequisite, setPrerequisite] = useState('');

    // Error Handing
    const [titleError, setTitleError] = useState('');
    const [priceError, setPriceError] = useState('');
    const [descriptionError, setDescriptionError] = useState('');

    // Other
    const [loginLoading, setLoginLoading] = useState(false);

    // Snackbar
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarType, setSnackbarType] = useState('error');
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [languageIds, setLanguageIds] = useState([]);

    const user = useContext(UserContext);

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
            title: title,
            price: price,
            level: level,
            description: description,
            prerequisite: prerequisite,
            languageId: languageId,
            teacherId: user.current.teacher.id
        };

        try {
            setLoginLoading(true);
            const response = await Api.post('/course', data);
            setLoginLoading(false);
            if (response.status === 200) {
                if (response.data.status === 200) {
                    setSnackbarType('success');
                    setSnackbarOpen(true);
                    setSnackbarMessage('دوره جدید با موفقیت ایجاد شد.');
                } else {
                    setSnackbarType('error');
                    setSnackbarOpen(true);
                    setSnackbarMessage(response.data.msg);
                }
            }
        } catch (error) {
            setLoginLoading(false);
            setSnackbarType('error')
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
        if (handleTitleError(title)) error = true;
        if (handlePriceError(price)) error = true;
        if (handleDescriptionError(description)) error = true;
        return error;
    }

    function handleTitleError(value) {
        if (value === '') {
            setTitleError('لطفا این فیلد را پر کنید.');
            return true;
        } else {
            setTitleError('');
            return false;
        }
    }

    function handlePriceError(value) {
        const regex = new RegExp('^\\d+$');
        if (regex.test(value) && value !== 0) {
            setPriceError('');
            return false;
        } else {
            setPriceError('لطفا قیمت معتبر وارد کنید.');
            return true;
        }
    }

    function handleDescriptionError(value) {
        if (value.length < 10) {
            setDescriptionError('لطفا حداقل ده کاراکتر وارد کنید.');
            return true;
        } else {
            setDescriptionError('');
            return false;
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
                ایجاد دوره جدید
            </Typography>
            <Container disableGutters maxWidth={'md'} sx={{p: {xs: 1, md: 2}}}>
                <Grid container spacing={{xs: 2, md: 3}}>
                    <Grid xs={12} sm={6}>
                        <TextField
                            onBlur={(e) => handleTitleError(e.target.value)}
                            error={titleError !== ''}
                            helperText={titleError}
                            required
                            fullWidth
                            label="عنوان"
                            autoFocus
                            value={title}
                            onChange={(e) => {
                                setTitle(e.target.value);
                                handleTitleError(e.target.value);
                            }}
                        />
                    </Grid>
                    <Grid xs={12} sm={6}>
                        <TextField
                            onBlur={(e) => {
                                if (e.target.value === '')
                                    setPrerequisite('بدون پیش نیاز');
                            }}
                            fullWidth
                            label="پیش نیاز ها"
                            value={prerequisite}
                            onFocus={(e) => {
                                if (e.target.value === 'بدون پیش نیاز')
                                    setPrerequisite('');
                            }}
                            onChange={(e) => {
                                setPrerequisite(e.target.value);
                            }}
                        />
                    </Grid>
                    <Grid xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel id={'language-label'}>زبان دوره</InputLabel>
                            <Select
                                autoWidth
                                labelId={'language-label'}
                                value={languageId}
                                onChange={(e) => setLanguageId(e.target.value)}
                                label={'زبان دوره'}
                                required
                            >
                                {
                                    languageIds.map(lng =>
                                        <MenuItem key={lng.id} value={lng.id} selected>{lng.name}</MenuItem>
                                    )
                                }

                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel id={'level-label'}>سطح دوره</InputLabel>
                            <Select
                                autoWidth
                                labelId={'level-label'}
                                value={level}
                                onChange={(e) => setLevel(e.target.value)}
                                label={'سطح دوره'}
                                required
                            >
                                <MenuItem value={'A1'} selected>Elementary</MenuItem>
                                <MenuItem value={'A2'}>Pre-Intermediate</MenuItem>
                                <MenuItem value={'B1'}>Intermediate</MenuItem>
                                <MenuItem value={'B2'}>Upper-Intermediate</MenuItem>
                                <MenuItem value={'C1'}>Advanced</MenuItem>
                                <MenuItem value={'C2'}>Proficiency</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid xs={12} sm={6}>
                        <TextField
                            onBlur={(e) => handleTitleError(e.target.value)}
                            error={priceError !== ''}
                            type={"number"}
                            helperText={priceError}
                            required
                            fullWidth
                            label="قیمت دوره"
                            value={price}
                            onChange={(e) => {
                                setPrice(e.target.value);
                                handlePriceError(e.target.value);
                            }}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">تومان</InputAdornment>,
                            }}
                        />
                    </Grid>
                    <Grid xs={12}>
                        <TextField
                            fullWidth
                            onBlur={(e) => handleDescriptionError(e.target.value)}
                            error={descriptionError !== ''}
                            helperText={descriptionError}
                            placeholder={'توضیحات'}
                            label={'توضیحات'}
                            multiline
                            value={description}
                            onChange={(e) => {
                                setDescription(e.target.value);
                                handleDescriptionError(e.target.value);
                            }}
                            minRows={4}
                            maxRows={5}
                            required
                        >
                        </TextField>
                    </Grid>
                    <Grid xs={12} sm={6} md={4}>
                        <LoadingButton
                            loading={loginLoading}
                            type="submit"
                            variant="contained"
                            fullWidth
                            onClick={handleSubmit}
                        >
                            <span>
                            ایجاد دوره
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

export default CreateCourse;