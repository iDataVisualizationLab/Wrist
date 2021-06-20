import Typography from "@material-ui/core/Typography";
import * as axios from "axios";
import TextField from "@material-ui/core/TextField";
import RoundButton from "./UI/RoundButton";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import React, {useEffect} from "react";
import {makeStyles} from "@material-ui/core/styles";
import {useLocation} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
}));
export default function ResetPassword(props) {
    const classes = useStyles();
    const {search} = useLocation();
    let token  = new URLSearchParams(search).get('token');
    const [password, setpassword] = React.useState();
    const [confirmPassword, setconfirmPassword] = React.useState();
    const [meassage, setmeassage] = React.useState('Verify your request...');
    useEffect(()=>{
        verify();
    },0);
    function verify(){
        axios.post(((process.env.NODE_ENV === 'production') ? process.env.REACT_APP_API_URL : process.env.REACT_APP_API_URL_LOCAL) + `/accounts/validate-reset-token`,{
            token
        }).then(respond => {
            setmeassage(null)
        }).catch(e => {
            if (e.response&& e.response.data && e.response.data.message)
                setmeassage(e.response.data.message);
            else
                setmeassage("Request Failed. Please try again.")
        })
    }
    return <Grid xs={12}>
        <div className={classes.paper}>
            {meassage ? <Grid containe>
                    <Grid item xs={12}><h2>{meassage}</h2></Grid>
                    <Grid item xs={12} container justify="center"><RoundButton variant="outlined" href='#/'>Home</RoundButton></Grid>
            </Grid> :<> <Typography component="h1" variant="h5">
                    Reset password
                </Typography>
                <form className={classes.form} method="get"
                      onSubmit={(event) => {
                          event.preventDefault();
                          axios.post(((process.env.NODE_ENV === 'production') ? process.env.REACT_APP_API_URL : process.env.REACT_APP_API_URL_LOCAL) + `/accounts/reset-password`, {
                              token,
                              password,
                              confirmPassword
                          })
                              .then(respond => {
                                  setmeassage(respond.data.message)
                              }).catch(e => {
                              if (e.response&& e.response.data && e.response.data.measage)
                                  setmeassage(e.response.data.measage);
                              else
                                  setmeassage("Request Failed. Please try again.")
                          })
                      }}>
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
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        id="confirmPassword"
                        onChange={(e) => setconfirmPassword(e.target.value)}
                        autoComplete="current-password"
                    />
                    <RoundButton
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Reset Password
                    </RoundButton>
                </form></>}
        </div>
    </Grid>
}
