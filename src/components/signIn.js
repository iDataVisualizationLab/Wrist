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
import {ReactComponent as DoctorImg} from '../image/doctors.svg'
import {
    useHistory,
    useLocation
} from "react-router-dom";
import * as axios from "axios";
import Slide from "@material-ui/core/Slide";
import RoundButton from "./UI/RoundButton";
import Paper from "@material-ui/core/Paper";
import Fade from "@material-ui/core/Fade";
import ForgotEmail from "./forgotEmail";
import api from "./api";

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
        textAlign: 'center'
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function SignIn(props) {
    const classes = useStyles();
    const [email, setemail] = React.useState();
    const [password, setpassword] = React.useState();
    const [isSigin, setisSigin] = React.useState(true);
    const [meassage, setmeassage] = React.useState();
    const [isError, setisError] = React.useState(false);
    return (
            <>
                <CssBaseline/>
                    <Grid container justify="center"
                          alignItems="center">
                        <Slide direction="left" in={true} mountOnEnter unmountOnExit>
                            <Grid xs={7} container justify="center"
                                  alignItems="center">
                                <DoctorImg/>
                                <Typography component="span" variant="span">
                                    Don't have an account? <RoundButton style={{margin:'auto'}}
                                                                        type="submit"
                                                                        variant="contained"
                                                                        color="secondary"
                                                                        className={classes.submit}
                                                                        href={"#/register"}>Create an account</RoundButton>
                                </Typography>
                            </Grid>
                        </Slide>
                        <Slide direction="right" in={isSigin} mountOnEnter unmountOnExit>
                            <Grid xs={5}>
                                <div className={classes.paper}>
                                    <Typography component="h1" variant="h5">
                                        Welcome back
                                    </Typography>
                                    <form className={classes.form} method="get"
                                          onSubmit={(event) => {
                                              event.preventDefault();
                                              api.login( {
                                                  email: email,
                                                  password: password,
                                              })
                                                  .then(respond => {
                                                      props.onSucess(respond)
                                                  }).catch(e => {
                                                  setmeassage("Login Failed. Please try again.")
                                              })
                                          }}>
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
                                                onChange={(e) => setpassword(e.target.value)}
                                                autoComplete="current-password"
                                            />
                                            {/*<FormControlLabel*/}
                                            {/*    control={<Checkbox value="remember" color="primary" />}*/}
                                            {/*    label="Remember me"*/}
                                            {/*/>*/}
                                            {
                                                <span>{meassage}</span>
                                            }
                                            <RoundButton
                                                type="submit"
                                                fullWidth
                                                variant="contained"
                                                color="primary"
                                                className={classes.submit}
                                            >
                                                Sign In
                                            </RoundButton>
                                            <Grid item xs={12}>
                                        <span
                                            style={{margin: 'auto'}}
                                        >
                                                Forgot <Link onClick={()=>setisSigin(false)}>password?</Link>
                                            </span>
                                            </Grid>
                                    </form>
                                </div>
                            </Grid>
                        </Slide>
                        <Fade direction="top" in={!isSigin} mountOnEnter unmountOnExit>
                            <ForgotEmail onClose={()=>{setisSigin(true)}}/>
                        </Fade>
                    </Grid>
                <Box mt={8}>
                    <Copyright/>
                </Box>
            </>
    );
}
