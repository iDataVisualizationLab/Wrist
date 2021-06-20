import Typography from "@material-ui/core/Typography";
import * as axios from "axios";
import TextField from "@material-ui/core/TextField";
import RoundButton from "./UI/RoundButton";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import React from "react";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
}));
export default function ForgotEmail(props) {
    const classes = useStyles();
    const [email, setemail] = React.useState();
    const [isError, setisError] = React.useState(false);
    const [meassage, setmeassage] = React.useState('');
    return <Grid xs={5}>
        <div className={classes.paper}>
            {meassage ? <Grid containe>
                    <Grid item xs={12}><h2>{meassage}</h2></Grid>
                    <Grid item xs={12} container justify="center"><RoundButton variant="outlined" onClick={props.onClose}>Back</RoundButton></Grid>
            </Grid> :<> <Typography component="h1" variant="h5">
                    Forgot password
                </Typography>
                <form className={classes.form} method="get"
                      onSubmit={(event) => {
                          event.preventDefault();
                          axios.post(((process.env.NODE_ENV === 'production') ? process.env.REACT_APP_API_URL : process.env.REACT_APP_API_URL_LOCAL) + `/accounts/forgot-password`, {
                              email
                          })
                              .then(respond => {
                                  setisError(false);
                                  setmeassage(respond.data.message)
                              }).catch(e => {
                              if (e.data && e.data.measage)
                                  setmeassage(e.data.measage);
                              else
                                  setmeassage("Request Failed. Please try again.")
                              setisError(true)
                          })
                      }}>
                    <span>Please input your email</span>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        type="email"
                        size="small"
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
                    <RoundButton
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Send
                    </RoundButton>
                </form></>}
        </div>
    </Grid>
}
