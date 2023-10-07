import {useNavigate} from "react-router-dom";
import Api from "../../Api/Api";
import {
    Box, Checkbox,
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
import {Alert} from "@mui/lab";
import {useContext, useState} from "react";
import userContext from "../../Contexts/UserContext";

function Register() {
    const user = useContext(userContext);
    const navigate = useNavigate();
    // Form inputs
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [alias, setAlias] = useState('');
    const [gender, setGender] = useState('MAN');
    const [rememberMe, setRememberMe] = useState(false);
    // Error handling
    const [firstNameError, setFirstNameError] = useState('');
    const [lastNameError, setLastNameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [aliasError, setAliasError] = useState('');

    // Other
    const [loginLoading, setLoginLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Snackbar
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarType, setSnackbarType] = useState('error');

    async function handleSubmit(e) {
        e.preventDefault();
        if (handleFormError())
            return;

        let data = {
            fName: firstName,
            lName: lastName,
            alias: alias,
            gender: gender,
            email: email,
            password: password,
            remember_me: rememberMe
        };

        try {
            setLoginLoading(true);
            const response = await Api.post('/register', data);
            setLoginLoading(false);
            if (response.status === 200) {
                if (response.data.status === 409) {
                    setSnackbarType('error');
                    setSnackbarOpen(true);
                    setSnackbarMessage('کاربری با این ایمیل قبلا ثبت نام شده است.');
                } else if (response.data.status === 200) {
                    navigate('/courses');
                    user.current.setNavigationMenuUser(response.data.data);
                    user.current.setAppBarUser(response.data.data);
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

    function handleFormError() {

        let error = false;
        if (handleEmailError(email)) error = true;
        if (handlePasswordError(password)) error = true;
        if (handleFirstNameError(firstName)) error = true;
        if (handleLastNameError(lastName)) error = true;
        if (handleAliasError(alias)) error = true;

        return error;
    }

    function handleAliasError(value) {
        if (value.length < 3) {
            setAliasError('لطفا این فیلد را پر کنید.');
            return true;
        } else {
            setAliasError('');
            return false;
        }
    }

    function handleFirstNameError(value) {
        let regex = /^[\u0600-\u06FF\s]+$/;
        if (!regex.test(value)) {
            setFirstNameError('لطفا یک نام معتبر وارد کنید.');
            return true;
        } else {
            setFirstNameError('');
            return false;
        }
    }

    function handleLastNameError(value) {
        let regex = /^[\u0600-\u06FF\s]+$/;
        if (!regex.test(value)) {
            setLastNameError('لطفا یک نام خانوادگی معتبر وارد کنید.');
            return true;
        } else {
            setLastNameError('');
            return false;
        }
    }

    function handleEmailError(value) {
        const regex = new RegExp('^[\\w-.]+@([\\w-]+\\.)+[\\w-]{2,4}$');
        if (!regex.test(value)) {
            setEmailError('یک ایمیل معتبر وارد کنید.');
            return true;
        } else {
            setEmailError('');
            return false;
        }
    }

    function handlePasswordError(value) {
        if (value.length < 8) {
            setPasswordError('رمز عبور حداقل 8 کاراکتر است.');
            return true;
        } else {
            setPasswordError('');
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
                ثبت نام
            </Typography>
            <Container disableGutters maxWidth={'md'} sx={{p: {xs: 1, md: 2}}}>
                <Grid container spacing={{xs: 2, md: 3}}>
                    <Grid xs={12} sm={6}>
                        <TextField
                            onBlur={(e) => handleFirstNameError(e.target.value)}
                            error={firstNameError !== ''}
                            helperText={firstNameError}
                            required
                            fullWidth
                            label="نام"
                            autoFocus
                            value={firstName}
                            onChange={(e) => {
                                setFirstName(e.target.value);
                                handleFirstNameError(e.target.value);
                            }}
                        />
                    </Grid>
                    <Grid xs={12} sm={6}>
                        <TextField
                            onBlur={(e) => handleLastNameError(e.target.value)}
                            error={lastNameError !== ''}
                            helperText={lastNameError}
                            required
                            fullWidth
                            label="نام خانوادگی"
                            value={lastName}
                            onChange={(e) => {
                                setLastName(e.target.value);
                                handleLastNameError(e.target.value);
                            }}
                        />
                    </Grid>
                    <Grid xs={12} sm={6}>
                        <TextField
                            onBlur={(e) => handleAliasError(e.target.value)}
                            error={aliasError !== ''}
                            helperText={aliasError}
                            required
                            fullWidth
                            label="نام مستعار"
                            value={alias}
                            onChange={(e) => {
                                setAlias(e.target.value);
                                handleAliasError(e.target.value);
                            }}
                        />
                    </Grid>
                    <Grid xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel id={'gender-label'}>جنسیت</InputLabel>
                            <Select
                                autoWidth
                                labelId={'gender-label'}
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                                label={'جنسیت'}
                            >
                                <MenuItem value={'MAN'} selected>مرد</MenuItem>
                                <MenuItem value={'WOMAN'}>زن</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid xs={12} sm={6}>
                        <TextField
                            type="email"
                            onBlur={(e) => handleEmailError(e.target.value)}
                            error={emailError !== ''}
                            helperText={emailError}
                            required
                            fullWidth
                            label="ایمیل"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                handleEmailError(e.target.value);
                            }}
                        />
                    </Grid>
                    <Grid xs={12} sm={6}>
                        <TextField
                            onBlur={(e) => handlePasswordError(e.target.value)}
                            helperText={passwordError}
                            error={passwordError !== ''}
                            required
                            fullWidth
                            label="رمز عبور"
                            type={showPassword ? 'test' : 'password'}
                            autoComplete="new-password"
                            value={password}
                            aria-required
                            onChange={(e) => {
                                setPassword(e.target.value);
                                handlePasswordError(e.target.value);
                            }}
                            InputProps={{
                                endAdornment:
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => setShowPassword(!showPassword)}
                                            onMouseDown={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <VisibilityOff/> : <Visibility/>}
                                        </IconButton>
                                    </InputAdornment>
                            }}
                        />
                    </Grid>
                    <Grid xs={12}>
                        <FormControlLabel
                            label={'مرا به خاطر بسپار'}
                            control={
                                <Checkbox
                                    checked={rememberMe}
                                    onChange={(e) => {
                                        setRememberMe(e.target.checked)
                                    }}
                                />}
                        >
                        </FormControlLabel>
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

export default Register;