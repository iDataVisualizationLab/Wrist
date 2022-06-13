import React, {useEffect} from 'react';
import {schemeCategory10} from "d3";
import Grid from "@material-ui/core/Grid";
import UserInfo from "./userInfo";
import {
    useParams, Switch, Route, useRouteMatch, Link, useHistory, useLocation
} from "react-router-dom";
import {scaleOrdinal} from 'd3-scale';
import notfound from '../image/notfound.png'
import Container from "@material-ui/core/Container";
import Redirect from "react-router-dom/es/Redirect";
import Button from "@material-ui/core/Button";
import HomeIcon from '@material-ui/icons/Home';
import api from "./api";
import TextField from "@material-ui/core/TextField/TextField";
import Input from "@material-ui/core/Input/Input";

function View(props) {
    let {path, url} = useRouteMatch();
    let location = useLocation();
    const [pass, setpass] = React.useState('');
    const [loginState, setloginState] = React.useState(false);
    let {from, message} = location.state || {from: {pathname: "/"}};

    function getmessage() {
        if (message) {
            switch (message.status) {
                case 401:
                    return <>
                        <Grid item ><h3 style={{display:'inline-block',marginBottom:0,marginRight:10}}>Using password</h3>
                            <TextField type={'password'} value={pass} onChange={(event)=>setpass(event.target.value)}>Using password</TextField>
                            <Button variant="contained" color="primary" onClick={()=>props.onrequestByPassword(pass)}>Sent</Button>
                        </Grid>
                        <Grid item ><h3>Or, <a style={{color: 'steelBlue'}} onClick={()=>setloginState(!loginState)}>login</a> to view</h3></Grid>
                    </>;
                case 403:
                    return <>
                        <Grid item>
                            <img src={notfound} style={{maxWidth: '500px', height: 'auto'}}/>
                        </Grid>
                        <Grid item>
                            <h1>Access denied</h1>
                        </Grid></>;
            }
        } else return <>
            <Grid item>
                <img src={notfound} style={{maxWidth: '500px', height: 'auto'}}/>
            </Grid>
            <Grid item>
                <h1>Not found</h1>
            </Grid></>;
    }
    function getAction(){
        if(message&&message.status===401 && loginState){
            return props.embededLogin
        }else
        return <Link to={{
            pathname: "/login",
            state: {from}
        }}>
            <Button variant="contained" color="primary" startIcon={<HomeIcon/>}>Return home</Button>
        </Link>
    }
    return <Grid
        container
        direction="row"
        justify="center"
        alignItems="flex-start"
    ><Switch>
        <Route exact path={path}>
            <Container maxWidth="sm">
                <Grid container direction="column" justify="center"
                      alignItems="center" style={{
                    position: 'fixed',
                    // maxWidth: '500px',
                    top: '50%',
                    left: '50%',
                    /* bring your own prefixes */
                    transform: 'translate(-50%, -50%)'
                }}>
                    {getmessage()}
                    <Grid item>
                        {getAction()}
                    </Grid>
                </Grid>
            </Container>
        </Route>
        <Route path={`${path}/:patientId`}>
            <SingleView {...props} />
        </Route>
    </Switch></Grid>
}

function SingleView(props) {
    let location = useLocation();
    let {patientId} = useParams();
    const [userData, setuserData] = React.useState({});
    const [redirect, setredirect] = React.useState(false);
    const [selectedIndex, setselectedIndex] = React.useState(undefined);
    const radarColor = React.useRef(props.radarColor ?? scaleOrdinal().range(schemeCategory10));
    useEffect(() => {
        viewPatient();
    }, 0);
    const viewPatient = () => {
        const id = patientId;
        api.getPatientData(id,{password:props.pass})
            .then(d => {
                setuserData(d);
                radarColor.current.domain([]);
            }).catch(e => {
            setredirect({
                status: e.response.status,
                message: e.response.data && e.response.data.message ? e.response.data.message : undefined
            })
        });
    };
    const onMouseOverIndex = (_id) => {
        setselectedIndex(_id);
    };

    return <>{redirect ? <Redirect to={{
        pathname: "/view",
        state: {from: location, message: redirect}
    }}/> : <>
        <Grid
            container
            direction="row"
            justify="center"
            alignItems="flex-start"
        >
            {/*{<UserInfo data={userData} viewMode={true} userEditMode={false} onMouseOver={onMouseOverIndex}*/}
            {/*          onLoad={props.onLoad}*/}
            {/*          newIndex={newIndex}*/}
            {/*          func={api.func}*/}
            {/*          viewIndex={viewIndex}*/}
            {/*          viewComment={viewComment}*/}
            {/*          selectedIndex={selectedIndex}*/}
            {/*          colors={radarColor.current} IndexEditMode={false}/>}*/}
            {
                props.UserInfo(userData)
            }
        </Grid>
        {/*<Grid item xs={6}>*/}
        {/*    <WristViz onLoad={props.onLoad} data={userData['WristIndex']} selectedIndex={selectedIndex} colors={radarColor.current}/>*/}
        {/*</Grid>*/}
    </>}</>;
}

export default View;
