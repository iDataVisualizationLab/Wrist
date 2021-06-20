import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import csc from 'country-state-city'
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
import {ReactComponent as DoctorImg} from '../image/doctor2.svg'
import {
    useHistory,
    useLocation
} from "react-router-dom";
import * as axios from "axios";
import Slide from "@material-ui/core/Slide";
import RoundButton from "./UI/RoundButton";
import MenuItem from "@material-ui/core/MenuItem";
import Autocomplete from "@material-ui/lab/Autocomplete";

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
const countryList = csc.getAllCountries();
export default function Registration(props) {
    const classes = useStyles();
    const [title, settitle] = React.useState();
    const [firstName, setfirstName] = React.useState();
    const [lastName, setlastName] = React.useState();
    const [acceptTerms, setacceptTerms] = React.useState(false);
    const [email, setemail] = React.useState();
    const [password, setpassword] = React.useState();
    const [confirmPassword, setconfirmPassword] = React.useState();
    const [profession, setprofession] = React.useState();
    const [institution, setinstitution] = React.useState();
    const [address, setaddress] = React.useState();
    const [city, setcity] = React.useState();
    const [cityO, setcityO] = React.useState(null);
    const [state, setstate] = React.useState();
    const [stateO, setstateO] = React.useState(null);
    const [country, setcountry] = React.useState();
    const [countryO, setcountryO] = React.useState(countryList.find(c => c.name === 'United States'));
    const [message, setmessage] = React.useState();
    const [stateList, setstateList] = React.useState([]);
    const [cityList, setcityList] = React.useState([]);
    return (
        <Container component="main" maxWidth="lg">
            <CssBaseline/><Grid container justify="center"
                                alignItems="center">
            <Slide direction="up" in={true} mountOnEnter unmountOnExit>
                <Grid xs={7}>
                    <div className={classes.paper}>
                        <Typography component="h1" variant="h5">
                            Create an account
                        </Typography>
                        <form className={classes.form} method="post"
                              onSubmit={(event) => {
                                  event.preventDefault();
                                  if (password === confirmPassword) {
                                      axios.post(((process.env.NODE_ENV === 'production') ? process.env.REACT_APP_API_URL : process.env.REACT_APP_API_URL_LOCAL) + `/accounts/register`, {
                                          title,
                                          firstName,
                                          lastName,
                                          profession,
                                          institution,
                                          address,
                                          city,
                                          state,
                                          country,
                                          email,
                                          password,
                                          confirmPassword,
                                          acceptTerms
                                      })
                                          .then(respond => {
                                              props.onSucess(respond.data)
                                          }).catch(e => {
                                          if (e.response)
                                              setmessage(e.response.data.message)
                                          else
                                              setmessage("Sign up Failed. Please try again.")
                                      })
                                  } else {
                                      setmessage('Passwords do not match');
                                  }
                              }}>
                            <Grid container>
                                <Grid container spacing={1}>
                                    <Grid item xs={2}>
                                        <TextField
                                            variant="outlined"
                                            margin="normal"
                                            fullWidth
                                            id="title"
                                            label="Title"
                                            name="title"
                                            select
                                            autoComplete="title"
                                            value={title}
                                            onChange={(e) => settitle(e.target.value)}
                                            autoFocus
                                            size="small"
                                        >
                                            {['Mr', 'Mrs', 'Miss', 'Ms', 'Dr'].map(d => <MenuItem key={d} value={d}>
                                                {d}
                                            </MenuItem>)}
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={5}>
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            margin="normal"
                                            id="firstName"
                                            label="First Name"
                                            name="firstName"
                                            autoComplete="firstName"
                                            value={firstName}
                                            onChange={(e) => setfirstName(e.target.value)}
                                            required
                                            size="small"
                                        />
                                    </Grid>
                                    <Grid item xs={5}>
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            margin="normal"
                                            id="lastName"
                                            label="Last Name"
                                            name="lastName"
                                            autoComplete="lastName"
                                            value={lastName}
                                            onChange={(e) => setlastName(e.target.value)}
                                            required
                                            size="small"
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
                                    size="small"
                                />
                                <Grid container spacing={1}>
                                    <Grid item xs={6}>
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
                                            size="small"
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
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
                                            size="small"
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container spacing={1}>
                                    <Grid item xs={6}>
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            margin="normal"
                                            id="profession"
                                            label="Profession"
                                            name="profession"
                                            autoComplete="profession"
                                            value={profession}
                                            onChange={(e) => setprofession(e.target.value)}
                                            required
                                            size="small"
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            margin="normal"
                                            id="institution"
                                            label="Institution"
                                            name="institution"
                                            autoComplete="institution"
                                            value={institution}
                                            onChange={(e) => setinstitution(e.target.value)}
                                            required
                                            size="small"
                                        />
                                    </Grid>
                                </Grid>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    multiline
                                    rows={2}
                                    margin="normal"
                                    id="address"
                                    label="Institution address"
                                    name="address"
                                    autoComplete="address"
                                    value={address}
                                    onChange={(e) => setaddress(e.target.value)}
                                    required
                                    size="small"
                                />
                                <Grid container spacing={1}>
                                    <Grid item xs={4}>
                                        <Autocomplete
                                            fullWidth
                                            options={cityList}
                                            value={cityO}
                                            getOptionLabel={d => d ? d.name : ''}
                                            // getOptionSelected={}
                                            onChange={(e, value) => {
                                                if (value) {
                                                    setcityO(value);
                                                    setcity(value.name);
                                                    const _state = csc.getStateByCodeAndCountry(value.stateCode,value.countryCode);
                                                    setstateO(_state);
                                                    setstate(_state.name);
                                                    const _country = csc.getCountryByCode(value.countryCode);
                                                    console.log(_state, _country)
                                                    setcountryO(_country);
                                                    setcountry(_country.name);
                                                }
                                            }
                                            }
                                            renderInput={(params) => <TextField {...params}
                                                                                variant="outlined"
                                                                                margin="normal"
                                                                                id="city"
                                                                                label="City"
                                                                                name="city"
                                                                                autoComplete="city"
                                                                                size="small"
                                                                                inputProps={{
                                                                                    ...params.inputProps,
                                                                                    autoComplete: 'new-password', // disable autocomplete and autofill
                                                                                }}
                                            />}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Autocomplete
                                            fullWidth
                                            options={stateList}
                                            value={stateO}
                                            getOptionLabel={d => d ? d.name : ''}
                                            // getOptionSelected={}
                                            onChange={(e, value) => {
                                                if (value) {
                                                    setstateO(value);
                                                    setstate(value.name);
                                                    setcityList(csc.getCitiesOfState(countryO.isoCode, value.isoCode));
                                                    setcityO(null);
                                                    setcity('');
                                                } else {
                                                    setcityList(csc.getCitiesOfCountry(countryO.isoCode));
                                                    setcityO(null);
                                                    setcity('');
                                                }
                                            }
                                            }
                                            renderInput={(params) => <TextField {...params}
                                                                                variant="outlined"
                                                                                margin="normal"
                                                                                id="state"
                                                                                label="State"
                                                                                name="state"
                                                                                autoComplete="state"
                                                                                size="small"
                                                                                inputProps={{
                                                                                    ...params.inputProps,
                                                                                    autoComplete: 'new-password', // disable autocomplete and autofill
                                                                                }}
                                            />}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Autocomplete
                                            fullWidth
                                            disableClearable
                                            options={countryList}
                                            value={countryO}
                                            // defaultValue={'United States'}
                                            getOptionLabel={d => d.name}
                                            // getOptionSelected={}
                                            onChange={(e, value) => {
                                                setcountryO(value);
                                                setcountry(value.name);
                                                setstateList(csc.getStatesOfCountry(value.isoCode));
                                                setcityList(csc.getCitiesOfCountry(value.isoCode));
                                                setstateO('');
                                                setstate('');
                                                setcityO('');
                                                setcity('');
                                                console.log(cityO, stateO)
                                            }
                                            }
                                            renderInput={(params) => <TextField {...params}
                                                                                variant="outlined"
                                                                                margin="normal"
                                                                                id="country"
                                                                                label="Country"
                                                                                name="country"
                                                                                autoComplete="country"
                                                                                size="small"
                                                                                inputProps={{
                                                                                    ...params.inputProps,
                                                                                    autoComplete: 'new-password', // disable autocomplete and autofill
                                                                                }}
                                                                                required/>}
                                            required
                                        />
                                    </Grid>
                                </Grid>
                                <FormControlLabel
                                    control={<Checkbox checked={acceptTerms}
                                                       onChange={e => setacceptTerms(e.target.checked)}
                                                       name="acceptTerms"/>}
                                    label="I agree to sign up in Wrist Index using my information"
                                />
                                {
                                    <span>{message}</span>
                                }
                                <Grid container justify="center">
                                    <Grid item xs={8}>
                                        <RoundButton
                                            type="submit"
                                            fullWidth='xs'
                                            variant="contained"
                                            color="secondary"
                                            className={classes.submit}
                                        >
                                            Sign Up
                                        </RoundButton>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </form>
                    </div>
                    <Box mt={8}>
                        <Copyright/>
                    </Box>
                </Grid>
            </Slide>
            <Slide direction="top" in={true} mountOnEnter unmountOnExit>
                <Grid xs={5} container justify="center"
                      alignItems="center">
                    <Typography component="h1" variant="h5">
                        Or, <RoundButton style={{margin: 'auto'}}
                                         type="submit"
                                         variant="contained"
                                         color="primary"
                                         className={classes.submit}
                                         href={"#/login"}>Log in</RoundButton>
                    </Typography>
                    <DoctorImg/>
                </Grid>
            </Slide>
        </Grid>
        </Container>
    );
}
