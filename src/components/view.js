import React, {useEffect} from 'react';
import * as axios from "axios";
import {schemeCategory10} from "d3";
import Grid from "@material-ui/core/Grid";
import UserInfo from "./userInfo";
import WristViz from "./wristViz";
import {
    useParams, Switch, Route, useRouteMatch, Link, useHistory,useLocation
} from "react-router-dom";
import { scaleOrdinal } from 'd3-scale';
import notfound from '../image/notfound.png'
import Container from "@material-ui/core/Container";
import Redirect from "react-router-dom/es/Redirect";
import Button from "@material-ui/core/Button";
import HomeIcon from '@material-ui/icons/Home';

function View(props) {
    let { path, url } = useRouteMatch();
    let location = useLocation();
    let { from } = location.state || { from: { pathname: "/" } };
    return <Grid
        container
        direction="row"
        justify="center"
        alignItems="flex-start"
    ><Switch>
        <Route exact path={path}>
            <Container maxWidth="sm">
                <Grid container direction="column" justify="center"
                      alignItems="center" style={{position: 'fixed',
                    maxWidth: '500px',
                    top: '50%',
                    left: '50%',
                    /* bring your own prefixes */
                    transform: 'translate(-50%, -50%)'}}>
                    <Grid item>
                        <img src={notfound} style={{width:'100%',height:'auto'}}/>
                    </Grid>
                    <Grid item>
                        <h1>Invalid link</h1>
                    </Grid>
                    <Grid item>
                        <Link to={{
                            pathname: "/login",
                            state: {from}
                        }}>
                    <Button variant="contained" color="primary" startIcon={<HomeIcon/>}>Return home</Button>
                        </Link>
                    </Grid>
                </Grid>
            </Container>
        </Route>
        <Route path={`${path}/:patientId`}>
            <SingleView {...props} />
        </Route>
    </Switch></Grid>
}
function SingleView(props){
    let location = useLocation();
    let { patientId } = useParams();
    const [userData, setuserData] = React.useState({});
    const [redirect, setredirect] = React.useState(false);
    const [selectedIndex, setselectedIndex] = React.useState(undefined);
    const radarColor = React.useRef(props.radarColor??scaleOrdinal().range(schemeCategory10));
    debugger
    useEffect(()=>{
        viewPatient();
    },0);
    const viewPatient = ()=>{
        debugger
        const id = patientId;
        axios.get(`${((process.env.NODE_ENV === 'production')?process.env.REACT_APP_API_URL:process.env.REACT_APP_API_URL_LOCAL)}/patientProfile/${id}`,{
            headers: {
                'Authorization': `Bearer ${props.token}`
            }
        })
            .then(r=>{
                debugger
                const d= r.data;
                setuserData(d);
                radarColor.current.domain([]);
            }).catch(e=>{
            setredirect(true)
        });
    };
    const onMouseOverIndex = (_id)=>{
        setselectedIndex(_id);
    };

    return <>{redirect?<Redirect to={{
        pathname: "/view",
        state: { from: location }
    }}/>:<>
        <Grid
            container
            direction="row"
            justify="center"
            alignItems="flex-start"
        >
            <UserInfo data={userData} viewMode={true} userEditMode={false}  onMouseOver={onMouseOverIndex}
                      onLoad={props.onLoad}
                      colors={radarColor.current} IndexEditMode={false}/>
        </Grid>
        {/*<Grid item xs={6}>*/}
        {/*    <WristViz onLoad={props.onLoad} data={userData['Wrist Index']} selectedIndex={selectedIndex} colors={radarColor.current}/>*/}
        {/*</Grid>*/}
    </>}</>;
}
export default View;
