import {Box, Button, Container, Stack, TextField, Typography} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import {grey} from "@mui/material/colors";
import {responsesAreSame} from "workbox-broadcast-update";
import Api from "../../Api/Api";
import {Link, useLoaderData} from "react-router-dom";
import {useState} from "react";

const style = {
    borderRadius: 2,
    backgroundColor: grey[300],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    py: {xs: 2, md: 4},
    height: '100%'
};

export async function loader() {
    const response = await Api.get('/languages');
    const allLanguages = response.data.data;
    return {allLanguages};
}

function Home() {
    const {allLanguages} = useLoaderData()
    const [languages, setLanguages] = useState(allLanguages);
    const [search, setSearch] = useState('');

    function handleSearch(value) {
        setSearch(value);
        const regex = new RegExp(value, 'i');
        setLanguages(allLanguages.filter(lng => regex.test(lng.name)));
    }

    return (
        <Box sx={{
            pt: 4
        }}>
            <Stack spacing={2}>
                <Typography component="h1" variant="h4" sx={{textAlign: 'center'}}>
                    آموزشگاه آریا
                </Typography>
                <Typography component="p" variant="body1" sx={{textAlign: 'center'}} color={'unImportant.main'}>
                    دنبال دوره آموزشی زبان مورد علاقت میگردی؟
                </Typography>
            </Stack>
            <Container disableGutters maxWidth={'md'} sx={{p: {xs: 1, md: 2}, mt: 2}}>
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
                        languages.map(lng =>
                            <Grid key={lng.id} xs={4} sm={3}>
                                <Link
                                    to={'/courses?language=' + lng.id}
                                    style={{textDecoration: "none"}}

                                >
                                    <Button sx={{...style}} fullWidth>
                                        <Typography component="span" variant="body1" sx={{textAlign: 'center'}}>
                                            {lng.name}
                                        </Typography>
                                    </Button>
                                </Link>
                            </Grid>
                        )
                    }
                </Grid>
            </Container>
        </Box>
    );
}

export default Home;