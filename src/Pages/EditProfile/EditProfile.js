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
import {useContext, useEffect, useState} from "react";

function EditProfile() {
    // Form inputs
    const [email, setEmail] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [alias, setAlias] = useState('');
    const [gender, setGender] = useState('MAN');
    // Error handling
    const [firstNameError, setFirstNameError] = useState('');
    const [lastNameError, setLastNameError] = useState('');
    const [newPasswordError, setNewPasswordError] = useState('');
    const [repeatPasswordError, setRepeatPasswordError] = useState('');
    const [oldPasswordError, setOldPasswordError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [aliasError, setAliasError] = useState('');

    // Other
    const [loginLoading, setLoginLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Snackbar
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarType, setSnackbarType] = useState('error');

    useEffect(() => {
        fetchUser();
    }, [])

    async function fetchUser() {
        console.log('editing profile')
        let response = await Api.get('/myProfile');
        setAlias(response.data.user.alias);
        setFirstName(response.data.user.fName);
        setLastName(response.data.user.lName);
        setGender(response.data.user.gender);
        setEmail(response.data.user.email);
    }

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
            password: oldPassword,
            newPassword: newPassword
        };

        try {
            setLoginLoading(true);
            const response = await Api.post('/updUser', data);
            setLoginLoading(false);
            if (response.status === 200) {
                if (response.data.status === 401) {
                    setSnackbarType('error');
                    setSnackbarOpen(true);
                    setSnackbarMessage('رمز عبور وارد شده صحیح نمی باشد!');
                } else if (response.data.status === 200) {
                    // user.current = response.data.data;
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
        if (handleOldPasswordError(oldPassword)) error = true;
        if (handleNewPasswordError(newPassword)) error = true;
        if (handleRepeatPasswordError(repeatPassword)) error = true;
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

    function handleRepeatPasswordError(value) {
        if (value !== newPassword) {
            setRepeatPasswordError('با رمز عبور وارد شده برابر نیست');
            return true;
        } else {
            setRepeatPasswordError('');
            return false;
        }
    }

    function handleNewPasswordError(value) {
        if (value.length < 8 && value.length !== 0) {
            setNewPasswordError('رمز عبور حداقل 8 کاراکتر است.');
            return true;
        } else {
            setNewPasswordError('');
            return false;
        }
    }

    function handleOldPasswordError(value) {
        if (value.length < 8) {
            setOldPasswordError('رمز عبور حداقل 8 کاراکتر است.');
            return true;
        } else {
            setOldPasswordError('');
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
                ویرایش پروفایل
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
                            onBlur={(e) => handleOldPasswordError(e.target.value)}
                            helperText={oldPasswordError}
                            error={oldPasswordError !== ''}
                            required
                            fullWidth
                            label="رمز عبور قبلی"
                            type={showPassword ? 'test' : 'password'}
                            value={oldPassword}
                            aria-required
                            onChange={(e) => {
                                setOldPassword(e.target.value);
                                handleOldPasswordError(e.target.value);
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
                        <Typography component={'p'} variant={"body1"}>
                            {'فقط در صورتی که میخواهید رمز عبور خود را تغییر دهید این دو فیلد را پر کنید.'}
                        </Typography>
                    </Grid>
                    <Grid xs={12} sm={6}>
                        <TextField
                            onBlur={(e) => handleNewPasswordError(e.target.value)}
                            helperText={newPasswordError}
                            error={newPasswordError !== ''}
                            fullWidth
                            label="رمز عبور جدید"
                            type={showPassword ? 'test' : 'password'}
                            autoComplete="new-password"
                            value={newPassword}
                            aria-required
                            onChange={(e) => {
                                setNewPassword(e.target.value);
                                handleNewPasswordError(e.target.value);
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
                    <Grid xs={12} sm={6}>
                        <TextField
                            onBlur={(e) => handleRepeatPasswordError(e.target.value)}
                            helperText={repeatPasswordError}
                            error={repeatPasswordError !== ''}
                            required={newPassword !== '' ? true : false}
                            fullWidth
                            label="تکرار رمز عبور"
                            type={showPassword ? 'test' : 'password'}
                            value={repeatPassword}
                            aria-required
                            onChange={(e) => {
                                setRepeatPassword(e.target.value);
                                handleRepeatPasswordError(e.target.value);
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
                    <Grid xs={12} sm={5} md={3}>
                        <LoadingButton
                            loading={loginLoading}
                            type="submit"
                            variant="contained"
                            fullWidth
                            onClick={handleSubmit}
                        >
                            <span>
                            ویرایش
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

export default EditProfile;