import React, {useEffect} from 'react';
import {makeStyles, withStyles, MuiThemeProvider, createMuiTheme, fade} from '@material-ui/core/styles';
import './App.css';
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import ManageUser from "./components/manageUser";
import {AppBar, Toolbar, Typography, IconButton, Container} from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu';
import Grid from "@material-ui/core/Grid";
import UserInfo from "./components/userInfo";
import {sum, mean, count, schemeCategory10, default as d3} from "d3";
import { scaleOrdinal } from 'd3-scale';
import PROMs from "./components/PROMs";
import WristIndex from "./components/WristIndex";
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import * as axios from "axios";
import WristViz from "./components/wristViz";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Dialog from "@material-ui/core/Dialog";
import SignIn from "./components/signIn";
import GetAppIcon from '@material-ui/icons/GetApp';
import RadioChoice from "./components/radioChoice";
import {BrowserRouter as Router, Route, Switch, useRouteMatch} from "react-router-dom";
import View from "./components/view";

const THEME = createMuiTheme({
    typography: {
        "fontFamily": `sans-serif`,
        // "fontSize": 14,
    }
});

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        display: 'flex',
    },
    paper: {
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        height: '100%'
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
    },
    tabs: {
        border: 'none',
        borderRight: `1px solid ${theme.palette.divider}`,
        width: '100%',
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    }
}));

const func ={
    'TAM EX-0-Flex':(arr,arr2)=>sum(arr)/sum(arr2),
    'TAM Pro-0-Sup':(arr,arr2)=>sum(arr)/sum(arr2),
    'TAM Rad-0-Ulnar':(arr,arr2)=>sum(arr)/sum(arr2),
    'Mean of 3 Trials': (arr,arr2)=> (sum(arr)/3)/(sum(arr2)/3),
    'Grip Strength Supination Ratio':(a,b)=> a/b,
    'Grip Strength Pronation Ratio':(a,b)=> a/b,
    'PSFS score':(PSFS)=>mean(PSFS),
    'PRWE Pain Scale':(PRWE)=>sum(PRWE.slice(0,5)),
    'PRWE Function subscale':(PRWE)=>(sum(PRWE.slice(5, 15))+(10-count(PRWE.slice(5, 15)))*mean(PRWE.slice(5, 15)))/2,
    'SANE score':(PRWE)=>PRWE[17],
    'MHQ score':(MHQ)=>(sum(MHQ)-5)/20*100,
};

function App() {
    const classes = useStyles();
    const [masterId, setmasterId] = React.useState();
    const [busy, setBusy] = React.useState(false);
    const [userData, setuserData] = React.useState({});
    // const [userInfoView, setuserInfoView] = React.useState(false);
    const [IndexView, setIndexView] = React.useState(false);
    const newIndexData = React.useRef({});
    const [onNewIndex, setonNewIndex] = React.useState(false);
    const [page, setPage] = React.useState(-1);
    const [reloadUserTable, setreloadUserTable] = React.useState(true);
    const [patientLists, setPatientLists] = React.useState([]);
    const [confirmFunc,setConfirmFunc] = React.useState(false);
    const [selectedIndex,setselectedIndex] = React.useState(undefined);
    const radarColor = React.useRef(scaleOrdinal().range(schemeCategory10));


    useEffect(()=>{
        if (reloadUserTable){
            setreloadUserTable(false);
            axios.get(`${((process.env.NODE_ENV === 'production')?process.env.REACT_APP_API_URL:process.env.REACT_APP_API_URL_LOCAL)}/patientProfile/list?managerBy=${masterId}`)
                .then(r=>{
                    setPatientLists(r.data)
                });
        }
    })

    const onLoad = (d) => {
        if (d === undefined)
            setBusy(false);
        else
            setBusy(d)
    };

    const newPatient = (d)=>{
        setuserData({});
        // setuserInfoView(false);
        setPage(1);
    };

    const editPatient = (data)=>{
        const id = data['_id'];
        axios.get(`${((process.env.NODE_ENV === 'production')?process.env.REACT_APP_API_URL:process.env.REACT_APP_API_URL_LOCAL)}/patientProfile?id=${id}`)
            .then(r=>{
                const d= r.data;
                setuserData(d);
                radarColor.current.domain([]);
                setPage(2);
                // setuserInfoView(true);
            });
    };

    const editIndex = (data)=>{
        newIndexData.current = data;
        setIndexView(false);
        setonNewIndex(true);
    };

     const viewIndex = (data)=>{
         newIndexData.current = data;
         setIndexView(true);
            setonNewIndex(true);
        };

    const viewPatient = (data)=>{
        const id = data['_id'];
        axios.get(`${((process.env.NODE_ENV === 'production')?process.env.REACT_APP_API_URL:process.env.REACT_APP_API_URL_LOCAL)}/patientProfile?id=${id}`)
            .then(r=>{
                debugger
                const d= r.data;
                setuserData(d);
                radarColor.current.domain([]);
                setPage(3);
                // setuserInfoView(true);
            });
    };

    const deletePatient = (data)=> {
        setConfirmFunc({
            title: 'Delete Patient Data',
            content: 'Delete all record and profile of patient: '+  data['Initials'],
            func: () => {
                const id = data['_id'];
                axios.get(`${((process.env.NODE_ENV === 'production') ? process.env.REACT_APP_API_URL : process.env.REACT_APP_API_URL_LOCAL)}/patientProfile/delete?id=${id}`)
                    .then(r => {
                        setConfirmFunc(false);
                        setreloadUserTable(true);
                        setPage(0);
                    });
            }
        })
    };
    const deleteIndex = (data)=> {
            setConfirmFunc({
                title: 'Delete Record Data',
                content: 'Delete record : '+  data['Date'],
                func: () => {
                    const id = data['_id'];
                    axios.get(`${((process.env.NODE_ENV === 'production') ? process.env.REACT_APP_API_URL : process.env.REACT_APP_API_URL_LOCAL)}/record/delete?id=${id}`)
                        .then(r => {
                            setConfirmFunc(false);
                            editPatient({_id:data.caseId});
                        });
                }
            })
        };

    const handleCloseConfirm = () => {
        setConfirmFunc(false);
    };

    const newIndex = (firstRecord)=>{
        if (firstRecord){
            newIndexData.current={
                "TAM EX-0-Flex": {
                    "Involved Hand": [0, 0],
                    "Contra-lateral Hand": firstRecord["TAM EX-0-Flex"]["Contra-lateral Hand"],
                    "result":0
                },
                "TAM Pro-0-Sup": {
                    "Involved Hand": [0, 0],
                    "Contra-lateral Hand": firstRecord["TAM Pro-0-Sup"]["Contra-lateral Hand"],
                    "result":0
                },
                "TAM Rad-0-Ulnar": {
                    "Involved Hand": [0, 0],
                    "Contra-lateral Hand": firstRecord["TAM Rad-0-Ulnar"]["Contra-lateral Hand"],
                    "result":0
                },
                "Mean of 3 Trials": {
                    "Involved Hand": [0, 0, 0],
                    "Contra-lateral Hand": firstRecord["Mean of 3 Trials"]["Contra-lateral Hand"],
                    "result":0
                },
                "Grip Strength Supination Ratio": {
                    "Involved Hand": [0],
                    "Contra-lateral Hand": firstRecord["Grip Strength Supination Ratio"]["Contra-lateral Hand"],
                    "result":0
                },
                "Grip Strength Pronation Ratio": {
                    "Involved Hand": [0],
                    "Contra-lateral Hand": firstRecord["Grip Strength Pronation Ratio"]["Contra-lateral Hand"],
                    "result":0
                },
                "Action": firstRecord["Action"]
            }
        }else{
            newIndexData.current = {};
        }
        newIndexData.current.caseId = userData['_id'];
        setIndexView(false);
        setonNewIndex({firstRecord:firstRecord});
    };

    const handleCancelNewIndex = (d)=>{
        setonNewIndex(false);
    };

    const getOutputData = (d)=>{
        if (typeof d == 'string'){
            return newIndexData.current[d]
        }else
            Object.keys(d).forEach(k=>{
                newIndexData.current[k] = d[k];
            });
    };

    const handleSubmitNewIndex = ()=>{
        if (!IndexView){
            axios.post(`${((process.env.NODE_ENV === 'production')?process.env.REACT_APP_API_URL:process.env.REACT_APP_API_URL_LOCAL)}/record`,newIndexData.current)
                .then((r)=>{
                    console.log(r);
                    debugger
                    if (!userData.prefill){
                        axios.post(`${((process.env.NODE_ENV === 'production')?process.env.REACT_APP_API_URL:process.env.REACT_APP_API_URL_LOCAL)}/patientProfile?id=${userData._id}`,
                            {
                                prefill:{
                                    "TAM EX-0-Flex": {
                                        "Contra-lateral Hand": newIndexData.current["TAM EX-0-Flex"]["Contra-lateral Hand"],
                                    },
                                    "TAM Pro-0-Sup": {
                                        "Contra-lateral Hand": newIndexData.current["TAM Pro-0-Sup"]["Contra-lateral Hand"],
                                    },
                                    "TAM Rad-0-Ulnar": {
                                        "Contra-lateral Hand": newIndexData.current["TAM Rad-0-Ulnar"]["Contra-lateral Hand"],
                                    },
                                    "Mean of 3 Trials": {
                                        "Contra-lateral Hand": newIndexData.current["Mean of 3 Trials"]["Contra-lateral Hand"]
                                    },
                                    "Grip Strength Supination Ratio": {
                                        "Contra-lateral Hand": newIndexData.current["Grip Strength Supination Ratio"]["Contra-lateral Hand"]
                                    },
                                    "Grip Strength Pronation Ratio": {
                                        "Contra-lateral Hand": newIndexData.current["Grip Strength Pronation Ratio"]["Contra-lateral Hand"]
                                    },
                                    "Action":newIndexData.current["Action"],
                                }
                            })
                    }
                    editPatient(userData);
                }).catch(e=>{
                    console.log(e)
                // handle error
            });
        }
        setonNewIndex(false);
    };
    const handleSubmitPatient = (data)=>{
        const sendData = {...data};
        delete sendData.prefill;
        delete sendData["Wrist Index"];
        axios.post(`${((process.env.NODE_ENV === 'production')?process.env.REACT_APP_API_URL:process.env.REACT_APP_API_URL_LOCAL)}/patientProfile?managerBy=${masterId}`,sendData)
            .then((respond)=>{
                editPatient(respond.data);
            }).catch(e=>{
                // handle error
        })
    };
    const onMouseOverIndex = (_id)=>{
        setselectedIndex(_id);
    }

    const renderPage = ()=>{
        switch (page) {
            case 1:
                return <Grid item xs={4}>
                    <UserInfo data={{managerBy:masterId}} viewMode={false} handleSubmitPatient={handleSubmitPatient}
                              userEditMode={true} IndexEditMode={true} newIndex={newIndex} />

                </Grid>;
            case 2:
                return <><Grid item xs={4}>
                    <UserInfo data={userData} viewMode={false} userEditMode={false}
                              handleSubmitPatient={handleSubmitPatient}
                              viewIndex={viewIndex}
                              editIndex={editIndex}
                              deleteIndex={deleteIndex}
                              onMouseOver={onMouseOverIndex}
                              IndexEditMode={true} newIndex={newIndex}
                              colors={radarColor.current}
                    />
                    {/*<UserInfo data={userData} viewMode={userInfoView} userEditMode={true} IndexEditMode={true} newIndex={newIndex} />*/}
                </Grid>
                    <Grid item xs={6}>
                        <WristViz onLoad={onLoad} data={userData['Wrist Index']} selectedIndex={selectedIndex} colors={radarColor.current}/>
                    </Grid>
                    </>;
            case 3:
                return <><Grid item xs={4}>
                    <UserInfo data={userData} viewMode={true} userEditMode={false}  onMouseOver={onMouseOverIndex}
                              colors={radarColor.current} IndexEditMode={false} newIndex={newIndex} />
                </Grid>
                    <Grid item xs={6}>
                        <WristViz onLoad={onLoad} data={userData['Wrist Index']} selectedIndex={selectedIndex} colors={radarColor.current}/>
                    </Grid>
                </>;
            case 0:
                return <Grid item xs={4}>
                    <Grid item xs={12} style={{paddingTop:10}}>
                        <span>Download </span>
                        <Button
                            variant="contained"
                            color="secondary"
                            size="small"
                            className={classes.AddButton}
                            startIcon={<GetAppIcon />}
                            download
                            href={`${((process.env.NODE_ENV === 'production')?process.env.REACT_APP_API_URL:process.env.REACT_APP_API_URL_LOCAL)}/download/usermanual`}
                            >User Manual</Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            size="small"
                            className={classes.AddButton}
                            startIcon={<GetAppIcon />}
                            download
                            href={`${((process.env.NODE_ENV === 'production')?process.env.REACT_APP_API_URL:process.env.REACT_APP_API_URL_LOCAL)}/download/wristEn`}
                        >Wrist Index Form</Button>
                    </Grid>
                    <ManageUser viewPatient={viewPatient} editPatient={editPatient}
                                deletePatient={deletePatient}
                                rows={patientLists}
                                onLoad={onLoad} newPatient={newPatient}/>
                </Grid>;
            default:
                return <Grid item xs={12} lg={4}>
                    <SignIn onSucess={(masterId)=>{setmasterId(masterId._id);setreloadUserTable(true); setPage(0)}}/>
                </Grid>
        }
    };

    return (<MuiThemeProvider theme={THEME}>
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton
                            edge="start"
                            className={classes.menuButton}
                            color="inherit"
                            aria-label="open drawer"
                        >
                            {(page>0)?<ArrowBackIosIcon onClick={()=>{setreloadUserTable(true);setPage(0);}}/>:''}
                        </IconButton>
                        <Typography className={classes.title} variant="h6" noWrap>
                            Wrist Index
                        </Typography>
                    </Toolbar>
                </AppBar>
            </div>
            <Router>
                <Switch>
                    <Route path="/Wrist/view">
                        <View
                            onLoad={onLoad}/>
                    </Route>
                    <Route path="/view">
                        <View
                        onLoad={onLoad}/>
                    </Route>
                    <Route path="/">
                        <Grid
                            container
                            direction="row"
                            justify="center"
                            alignItems="flex-start"
                        >
                            {renderPage()}
                        </Grid>
                    </Route>
                </Switch>
            </Router>

            <Dialog
                open={confirmFunc}
                onClose={handleCloseConfirm}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{confirmFunc.title}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {confirmFunc.content}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseConfirm} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={confirmFunc.func} color="primary" autoFocus>
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
            {onNewIndex?<WristIndex func={func} open={onNewIndex} first={onNewIndex.firstRecord} viewMode={IndexView} handleCancel={handleCancelNewIndex} getOutputData={getOutputData} handleSubmit={handleSubmitNewIndex}/>:''}
            <Backdrop className={classes.backdrop} open={busy !== false}>
                <CircularProgress color="secondary"/>
                <span>{(busy || {text: ''}).text}</span>
            </Backdrop>
        </MuiThemeProvider>
    );
}

export default App;
