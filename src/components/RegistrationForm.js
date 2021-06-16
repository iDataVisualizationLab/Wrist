import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {
    useHistory,
    useLocation
} from "react-router-dom";
import * as axios from "axios";

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://https://idatavisualizationlab.github.io/">
                idvl
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function Registration(props) {
    const classes = useStyles();
    const [title, settitle] = React.useState();
    const [firstName, setfirstName] = React.useState();
    const [lastName, setlastName] = React.useState();
    const [acceptTerms, setacceptTerms] = React.useState(false);
    const [email, setemail] = React.useState();
    const [password, setpassword] = React.useState();
    const [confirmPassword, setconfirmPassword] = React.useState();
    const [meassage, setmeassage] = React.useState();
    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline/>
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign up
                </Typography>
                <form className={classes.form} method="post"
                      onSubmit={(event) => {
                          event.preventDefault();
                          if (password === confirmPassword) {
                              axios.post(((process.env.NODE_ENV === 'production') ? process.env.REACT_APP_API_URL : process.env.REACT_APP_API_URL_LOCAL) + `/accounts/register`, {
                                  title,
                                  firstName,
                                  lastName,
                                  email,
                                  password,
                                  confirmPassword,
                                  acceptTerms
                              })
                                  .then(respond => {
                                      props.onSucess(respond.data)
                                  }).catch(e => {
                                      if(e.response)
                                            setmeassage(e.response.data.message)
                                        else
                                            setmeassage("Sign up Failed. Please try again.")
                              })
                          } else {
                              setmeassage('Passwords do not match');
                          }
                      }}>
                    <Grid container>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            id="title"
                            label="Title"
                            name="title"
                            autoComplete="title"
                            value={title}
                            onChange={(e) => settitle(e.target.value)}
                            autoFocus
                        />
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    id="firstName"
                                    label="First Name"
                                    name="firstName"
                                    autoComplete="firstName"
                                    value={firstName}
                                    onChange={(e) => setfirstName(e.target.value)}
                                    required
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    id="lastName"
                                    label="Last Name"
                                    name="lastName"
                                    autoComplete="lastName"
                                    value={lastName}
                                    onChange={(e) => setlastName(e.target.value)}
                                    required
                                />
                            </Grid>
                        </Grid>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            type="email"
                            required
                            fullWidth
                            id="email"
                            label="Email"
                            name="email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setemail(e.target.value)}
                            autoFocus
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setpassword(e.target.value)}
                            autoComplete="current-password"
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="confirmPassword"
                            label="Confirm Password"
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setconfirmPassword(e.target.value)}
                        />
                        <FormControlLabel
                            control={<Checkbox checked={acceptTerms} onChange={e=>setacceptTerms(e.target.checked)} name="acceptTerms" />}
                            label="I agree to sign up in Wrist Index using my email"
                        />

                        {/*<FormControlLabel*/}
                        {/*    control={<Checkbox value="remember" color="primary" />}*/}
                        {/*    label="Remember me"*/}
                        {/*/>*/}
                        {
                            <span>{meassage}</span>
                        }
                        <span
                            variant="contained"
                            style={{margin:'auto'}}
                        >
                            Already have an account? <Link href={"#/login"}>Log in</Link>
                        </span>
                        <Button
                            type="submit"

                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            Sign Up
                        </Button>
                        {/*<Grid container>*/}
                        {/*    <Grid item xs>*/}
                        {/*        <Link href="#" variant="body2">*/}
                        {/*            Forgot password?*/}
                        {/*        </Link>*/}
                        {/*    </Grid>*/}
                        {/*    <Grid item>*/}
                        {/*        <Link href="#" variant="body2">*/}
                        {/*            {"Don't have an account? Sign Up"}*/}
                        {/*        </Link>*/}
                        {/*    </Grid>*/}
                        {/*</Grid>*/}
                    </Grid>
                </form>
            </div>
            <Box mt={8}>
                <Copyright/>
            </Box>
        </Container>
    );
}
