import React, {useEffect} from 'react';
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
    useLocation, useParams
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

export default function VerifyEmail(props) {
    const classes = useStyles();
    console.log(useLocation())
    const {search} = useLocation();
    let token  = new URLSearchParams(search).get('token');
    const [isSuccess, setisSuccess] = React.useState(false);
    useEffect(()=>{
        verify();
    },0);
    const verify = ()=>{
        axios.post(`${((process.env.NODE_ENV === 'production')?process.env.REACT_APP_API_URL:process.env.REACT_APP_API_URL_LOCAL)}/accounts/verify-email/`,{
            token
        })
            .then(r=>{
                setisSuccess(true);
                const d= r.data;
            }).catch(e=>{
                setisSuccess(false)
        });
    };
    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline/>
            <div className={classes.paper}>{
                isSuccess?<Typography component="h1" variant="h5">
                    Your email is success verified. You can <Link href="/login">login</Link> now.
                </Typography>:<Typography component="h1" variant="h5">
                    Your email is fail to verify.
                </Typography>
                }
            </div>
            <Box mt={8}>
                <Copyright/>
            </Box>
        </Container>
    );
}
