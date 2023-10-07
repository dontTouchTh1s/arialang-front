import {
    Box, Checkbox,
    Container,
    FormControlLabel,
    IconButton,
    InputAdornment,
    Snackbar,
    TextField,
    Typography,
    Alert
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import LoadingButton from '@mui/lab/LoadingButton';

import {useContext, useState} from "react";
import {useNavigate, useOutletContext} from "react-router-dom";
import Api from "../../Api/Api";
import userContext from "../../Contexts/UserContext";

function Login({onLogin = null}) {
    const navigate = useNavigate();
    const user = useContext(userContext)
    // Inputs
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    // Error handling
    const [passwordError, setPasswordError] = useState('');
    const [emailError, setEmailError] = useState('');

    // Other
    const [loginLoading, setLoginLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Snackbar
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarType, setSnackbarType] = useState('error');
    const setSnackbarStatus = useOutletContext()[1];

    async function handleSubmit(e) {
        e.preventDefault();
        if (handleFormError())
            return;

        let data = {
            email: email,
            password: password
        };

        try {
            setLoginLoading(true);
            const response = await Api.post('/login', data);
            setLoginLoading(false);
            if (response.status === 200) {
                if (response.data.status === 400) {
                    setSnackbarType('error');
                    setSnackbarOpen(true);
                    setSnackbarMessage('نام کاربری یا رمز عبور صحیح نمی باشد.');
                } else if (response.data.status === 200) {
                    user.current.setNavigationMenuUser(response.data.data);
                    user.current.setAppBarUser(response.data.data);
                    if (onLogin)
                        onLogin();
                    else {
                        setSnackbarStatus({
                            open: true,
                            message: 'خوش آمدید، ' + response.data.data.alias,
                            type: 'success'
                        });
                        navigate('/courses');
                    }
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

        return error;
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
                ورود
            </Typography>
            <Container disableGutters maxWidth={'xs'} sx={{p: {xs: 1, md: 2}}}>
                <Grid container spacing={{xs: 2, md: 3}}>
                    <Grid xs={12}>
                        <TextField
                            type="email"
                            onBlur={(e) => handleEmailError(e.target.value)}
                            error={emailError !== ''}
                            helperText={emailError}
                            required
                            fullWidth
                            label="ایمیل"
                            autoComplete="email"
                            autoFocus
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                handleEmailError(e.target.value);
                            }}
                        />
                    </Grid>
                    <Grid xs={12}>
                        <TextField
                            onBlur={(e) => handlePasswordError(e.target.value)}
                            helperText={passwordError}
                            error={passwordError !== ''}
                            required
                            fullWidth
                            label="رمز عبور"
                            type={showPassword ? 'test' : 'password'}
                            autoComplete="current-password"
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
                    <Grid xs={12}>
                        <LoadingButton
                            loading={loginLoading}
                            type="submit"
                            variant="contained"
                            fullWidth
                            onClick={handleSubmit}
                        >
                            <span>
                            ورود
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

export default Login;