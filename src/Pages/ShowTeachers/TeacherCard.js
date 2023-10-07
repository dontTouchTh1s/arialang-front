import {Avatar, Box, Button, Card, CardActions, CardContent, CardHeader, Chip, Typography} from "@mui/material";
import SchoolIcon from '@mui/icons-material/School';
import GradingIcon from '@mui/icons-material/Grading';
import {Link} from "react-router-dom";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PhoneEnabledIcon from '@mui/icons-material/PhoneEnabled';
import moment from "moment-jalaali";

function TeacherCard({teacher}) {
    return (
        <>
            <Card>
                <CardHeader
                    avatar={<Avatar>
                        <AccountCircleIcon/>
                    </Avatar>}
                    subheader={'عضویت: ' + moment(teacher.createdAt).format('jYYYY/jMM/jDD')}
                    title={teacher.user.fName + ' ' + teacher.user.lName}>
                </CardHeader>

                <CardContent>
                    <Box sx={{
                        display: 'flex',
                        gap: '8px',
                        flexDirection: 'column'
                    }}>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',

                        }}>
                            <PhoneEnabledIcon color={'unImportant'}/>
                            <Typography component={'span'} variant={'body1'} fontWeight={300} fontSize={'.95rem'} sx={{
                                flexGrow: 1
                            }}>
                                {'شماره تماس: '}
                            </Typography>
                            <Typography component={'span'} variant={'body1'} fontWeight={300} fontSize={'.95rem'}
                                        textAlign={'right'}>
                                {teacher.user.mobile}
                            </Typography>
                        </Box>
                    </Box>
                    <Typography component={'p'} variant={'body1'} pt={1}>
                        {teacher.resume}
                    </Typography>

                </CardContent>
                <CardActions>
                    <Link
                        to={'/teachers/' + teacher.id}>
                        <Button size="small">مشاهده</Button>
                    </Link>
                </CardActions>
            </Card>
        </>
    );
}

export default TeacherCard;