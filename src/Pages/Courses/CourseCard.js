import {Box, Button, Card, CardActions, CardContent, CardHeader, Chip, Typography} from "@mui/material";
import SchoolIcon from '@mui/icons-material/School';
import GradingIcon from '@mui/icons-material/Grading';
import {Link} from "react-router-dom";

function CourseCard({course}) {
    const level = course.level === 'A1' ? 'Elementary' :
        course.level === 'A2' ? 'Pre-Intermediate' :
            course.level === 'B1' ? 'Intermediate' :
                course.level === 'B2' ? 'Upper-Intermediate' :
                    course.level === 'C1' ? 'Advanced' :
                        course.level === 'C2' ? 'Proficiency' : ''
    return (
        <>
            <Card>
                <CardHeader title={course.title}>
                </CardHeader>

                <Box sx={{
                    padding: '0 16px',
                    display: 'flex',
                    gap: '8px',
                    flexWrap: 'wrap',
                }}>
                    <Chip
                        label={level}
                        color='info'
                        variant={'outlined'}></Chip>
                    <Chip
                        variant={'outlined'}
                        label={course.language.name}></Chip>
                </Box>

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
                            <SchoolIcon color={'unImportant'}/>
                            <Typography component={'span'} variant={'body1'} fontWeight={300} fontSize={'.95rem'}>
                                {'مدرس: '}
                                {course.teacher.user.fName + ' ' + course.teacher.user.lName}
                            </Typography>
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',

                        }}>
                            <GradingIcon color={'unImportant'}/>
                            <Typography component={'span'} variant={'body1'} fontWeight={300} fontSize={'.95rem'}>
                                {'پیش نیاز: '}
                                {course.prerequisite}
                            </Typography>
                        </Box>
                    </Box>
                    <Typography component={'p'} variant={'body1'} pt={1}>
                        {course.description}
                    </Typography>

                </CardContent>
                <CardActions>
                    <Link
                        to={'/courses/' + course.id}>
                        <Button size="small">مشاهده</Button>
                    </Link>
                </CardActions>

            </Card>
        </>
    );
}

export default CourseCard;