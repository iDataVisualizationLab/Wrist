import React, {useEffect, useRef} from 'react';
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
import WristIndex from "./components/Wrist/WristIndex";
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import * as axios from "axios";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Dialog from "@material-ui/core/Dialog";
import SignIn from "./components/signIn";
import GetAppIcon from '@material-ui/icons/GetApp';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import {
    BrowserRouter as Router,
    Link,
    Route,
    Switch,
    useRouteMatch,
    Redirect,
    useHistory,
    useLocation
} from "react-router-dom";
import View from "./components/view";
import Registration from "./components/RegistrationForm";
import VerifyEmail from "./components/VerifyEmail";
import ResetPassword from "./components/resetPassword";
import RoundButton from "./components/UI/RoundButton";
import AccountCircle from '@material-ui/icons/AccountCircle';
import api from "./components/api";
import PatientChart from "./components/Wrist/PatientChart";
import Comment from "./components/Comment";

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
    },
    grow:{
        flexGrow: 1,
    }
}));

function App() {
    const classes = useStyles();
    const [auth, setauth] = React.useState(null);
    const [viewPass, setviewPass] = React.useState('');
    const [busy, setBusy] = React.useState(false);
    const [userData, setuserData] = React.useState({});
    // const [userInfoView, setuserInfoView] = React.useState(false);
    const [CommentView, setCommentView] = React.useState(false);
    const [onNewComment, setonNewComment] = React.useState(false);
    const [IndexView, setIndexView] = React.useState(false);
    const newIndexData = React.useRef({});
    const [onNewIndex, setonNewIndex] = React.useState(false);
    const [page, setPage] = React.useState(0);
    const [reloadUserTable, setreloadUserTable] = React.useState(auth?true:false);
    const [patientLists, setPatientLists] = React.useState([]);
    const [confirmFunc,setConfirmFunc] = React.useState(false);
    const [selectedIndex,setselectedIndex] = React.useState(undefined);
    const radarColor = React.useRef(scaleOrdinal().range(schemeCategory10));
    let { path, url } = useRouteMatch();
    let history = useHistory();
    let location = useLocation();
    let { from } = location.state || { from: { pathname: "/" } };
    const firstUpdate = useRef(true);
    useEffect(async ()=>{
        if (firstUpdate.current) {
            firstUpdate.current = false;
            let token = localStorage.getItem("refreshToken");
            debugger
            if (token) {
                try {
                    const res = await api.refreshToken({token});
                    localStorage.setItem("accessToken", res.data.jwtToken);
                    localStorage.setItem("refreshToken", res.data.refreshToken);
                    setauth(res.data);
                    setreloadUserTable(true);
                    setPage(0);
                } catch (error) {
                    console.error(error);
                }
            }
        }
        if (reloadUserTable){
            setreloadUserTable(false);
            api.getPatientsData(auth.id)
                .then(r=>{
                    setPatientLists(r)
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
        api.getPatientData(id)
            .then(d=>{
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

     const viewComment = (data)=>{
         newIndexData.current = data;
         setCommentView(true);
         setonNewComment(true);
     }

     const editComment = (data)=>{
         newIndexData.current = data;
         setCommentView(false);
         setonNewComment(true);
     }

    const viewPatient = (data)=>{
        const id = data['_id'];
        api.getPatientData(id)
            .then(d=>{
                setuserData(d);
                radarColor.current.domain([]);
                setPage(3);
            });
    };

    const deletePatient = (data)=> {
        setConfirmFunc({
            title: 'Delete Patient Data',
            content: 'Delete all record and profile of patient: '+  data['Initials'],
            func: () => {
                const id = data['_id'];
                axios.delete(`${((process.env.NODE_ENV === 'production') ? process.env.REACT_APP_API_URL : process.env.REACT_APP_API_URL_LOCAL)}/patientProfile/${id}`)
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
                    axios.delete(`${((process.env.NODE_ENV === 'production') ? process.env.REACT_APP_API_URL : process.env.REACT_APP_API_URL_LOCAL)}/record/${id}`)
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

    const newIndex = (firstRecord,history)=>{
        debugger
        if (firstRecord && Object.keys(firstRecord).length){
            newIndexData.current={
                "TAM EX-0-Flex": {
                    "Involved Hand": [0, 0],
                    "Contra-lateral Hand": firstRecord["TAM EX-0-Flex"]?firstRecord["TAM EX-0-Flex"]["Contra-lateral Hand"]:[0,0],
                    "result":0
                },
                "TAM Pro-0-Sup": {
                    "Involved Hand": [0, 0],
                    "Contra-lateral Hand": firstRecord["TAM Pro-0-Sup"]["Contra-lateral Hand"]?firstRecord["TAM Pro-0-Sup"]["Contra-lateral Hand"]:[0,0],
                    "result":0
                },
                "TAM Rad-0-Ulnar": {
                    "Involved Hand": [0, 0],
                    "Contra-lateral Hand": firstRecord["TAM Rad-0-Ulnar"]["Contra-lateral Hand"]?firstRecord["TAM Rad-0-Ulnar"]["Contra-lateral Hand"]:[0,0],
                    "result":0
                },
                "Mean of 3 Trials": {
                    "Involved Hand": [0, 0, 0],
                    "Contra-lateral Hand": firstRecord["Mean of 3 Trials"]["Contra-lateral Hand"]?firstRecord["Mean of 3 Trials"]["Contra-lateral Hand"]:[0,0,0],
                    "result":0
                },
                "Grip Strength Supination Ratio": {
                    "Involved Hand": [0],
                    "Contra-lateral Hand": firstRecord["Grip Strength Supination Ratio"]["Contra-lateral Hand"]?firstRecord["Grip Strength Supination Ratio"]["Contra-lateral Hand"]:[0,],
                    "result":0
                },
                "Grip Strength Pronation Ratio": {
                    "Involved Hand": [0],
                    "Contra-lateral Hand": firstRecord["Grip Strength Pronation Ratio"]["Contra-lateral Hand"]?firstRecord["Grip Strength Pronation Ratio"]["Contra-lateral Hand"]:[0,],
                    "result":0
                },
                "PSFS": firstRecord["PSFS"],
                "Action": firstRecord["Action"]
            }
            if (history&&history.length){
                if (history[0].PRWE)
                    newIndexData.current.PRWE = history[0].PRWE.map((d,i)=>mean(history.map(d=>d.PRWE),e=>e[i])??null)
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

    const handleCancelNewComment = (d)=>{
        setonNewComment(false);
    };

    const handleSubmitNewComment = ()=>{
        if (!CommentView && newIndexData.current){
            api.updateRecord({comment:newIndexData.current.comment},newIndexData.current._id).then(r=>{
                editPatient(userData);
            }).catch(e=>console.log(e));
        }
        setonNewComment(false);
    }

    const handleSubmitNewIndex = ()=>{
        if (!IndexView){
            api.submitRecord(newIndexData.current)
                .then((r)=>{
                    // if (!userData.prefill){
                        axios.post(`${((process.env.NODE_ENV === 'production')?process.env.REACT_APP_API_URL:process.env.REACT_APP_API_URL_LOCAL)}/patientProfile/${userData._id}`,
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
                                    "PSFS": newIndexData.current["PSFS"]
                                    ,
                                    "Action":newIndexData.current["Action"],
                                }
                            }).then(r=>{
                            editPatient(userData);
                        })
                    // }
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
        delete sendData["WristIndex"];
        axios.post(`${((process.env.NODE_ENV === 'production')?process.env.REACT_APP_API_URL:process.env.REACT_APP_API_URL_LOCAL)}/patientProfile/create`,sendData)
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
        debugger
        switch (page) {
            case 1:
                return <Grid item xs={5}>
                    <UserInfo data={{managerBy:auth.id}} viewMode={false} handleSubmitPatient={handleSubmitPatient}
                              userEditMode={true} IndexEditMode={true} newIndex={newIndex} />

                </Grid>;
            case 2:
                return <><Grid item xs={12}>
                    <UserInfo data={userData} viewMode={false} userEditMode={false}
                              handleSubmitPatient={handleSubmitPatient}
                              viewIndex={viewIndex}
                              editIndex={editIndex}
                              editComment={editComment}
                              deleteIndex={deleteIndex}
                              onMouseOver={onMouseOverIndex}
                              IndexEditMode={true} newIndex={newIndex}
                              colors={radarColor.current}
                              func={api.func} onLoad={onLoad}
                              selectedIndex={selectedIndex}
                    />
                    {/*<UserInfo data={userData} viewMode={userInfoView} userEditMode={true} IndexEditMode={true} newIndex={newIndex} />*/}
                </Grid>
                    {/*<Grid item xs={7}>*/}
                    {/*    <WristViz func={func} onLoad={onLoad} data={userData['WristIndex']} selectedIndex={selectedIndex} colors={radarColor.current}/>*/}
                    {/*</Grid>*/}
                    </>;
            case 3:
                return <><Grid item xs={12}>
                    <UserInfo data={userData} viewMode={true} userEditMode={false}  onMouseOver={onMouseOverIndex}
                              colors={radarColor.current} IndexEditMode={false} newIndex={newIndex}
                              func={api.func} onLoad={onLoad}
                              viewIndex={viewIndex}
                              viewComment={viewComment}
                              selectedIndex={selectedIndex}/>
                </Grid>
                    {/*<Grid item xs={7}>*/}
                    {/*    <WristViz func={func} onLoad={onLoad} data={userData['WristIndex']} selectedIndex={selectedIndex} colors={radarColor.current}/>*/}
                    {/*</Grid>*/}
                </>;
            case 0:
                return <Container>
                    <Grid item container xs={12} style={{paddingTop:10}} spacing={1} alignItems={"center"}>
                        <Grid item> Download </Grid>
                        <Grid item>
                            <Button
                                variant="contained"
                                color="secondary"
                                size="small"
                                className={classes.AddButton}
                                startIcon={<GetAppIcon />}
                                download
                                href={`${((process.env.NODE_ENV === 'production')?process.env.REACT_APP_API_URL:process.env.REACT_APP_API_URL_LOCAL)}/download/usermanual`}
                                >User Manual</Button>
                        </Grid>
                        <Grid item>
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
                    </Grid>
                    <ManageUser viewPatient={viewPatient} editPatient={editPatient}
                                deletePatient={deletePatient}
                                rows={patientLists}
                                onShare={api.sharePatient}
                                onLoad={onLoad} newPatient={newPatient}/>
                    <PatientChart label={patientLists.map(d=>({id:d._id,name:d.Initials}))} data={patientLists.map(d=>d.WristIndex)}/>
                </Container>;
            default:
                return ''
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
                        <Link to="/" style={{color: 'inherit', /* blue colors for links too */
                            textDecoration: 'inherit' /* no underline */}}>
                            <Button color="inherit">
                            <Typography className={classes.title} variant="h6" noWrap>
                                Wrist Index
                            </Typography>
                            </Button>
                        </Link>
                        <div className={classes.grow} />
                        {
                            auth?<>
                                Hi, {auth.role==='Admin'&&'Admin'} <AccountCircle style={{marginLeft:10,marginRight:10}}/> {auth.firstName} {auth.lastName}
                                <RoundButton
                                color={"primary"}
                                variant={"contained"}
                                startIcon={<ExitToAppIcon />}
                                onClick={()=>{api.logout().then(r=>{
                                    api.cleanToken();
                                    setauth(null);history.push("/");
                                }).catch(e=>{
                                    api.cleanToken();
                                    setauth(null);history.push("/");
                                })}}>Log out</RoundButton>
                            </>:''
                        }
                    </Toolbar>
                </AppBar>
            </div>
            {/*<Router>*/}
                <Switch>
                    <Route path="/view">
                        <View
                            token={auth?auth.jwtToken:null}
                            pass={viewPass}
                            onrequestByPassword={(viewPass)=>{
                                debugger
                                console.log(viewPass)
                                setviewPass(viewPass);
                                history.replace(from);
                            }}
                            UserInfo={(data)=><UserInfo data={data} viewMode={true} userEditMode={false}  onMouseOver={onMouseOverIndex}
                                                        colors={radarColor.current} IndexEditMode={false} newIndex={newIndex}
                                                        func={api.func} onLoad={onLoad}
                                                        viewIndex={viewIndex}
                                                        viewComment={viewComment}
                                                        selectedIndex={selectedIndex}/>}
                            embededLogin={<SignIn
                                auth={auth}
                                onSucess={(res) => {
                                    const auth = res.data;
                                    localStorage.setItem("accessToken", auth.jwtToken);
                                    localStorage.setItem("refreshToken", auth.refreshToken);

                                    setauth(auth);
                                    setreloadUserTable(true);
                                    setPage(0);
                                    history.replace(from);
                                }}/>}
                        onLoad={onLoad}/>
                    </Route>
                    <Route path="/login">
                        {auth ? <Redirect to={'/'}/> : <Grid
                            container
                            direction="row"
                            justify="center"
                            alignItems="flex-start"
                        >
                            <Grid item xs={12} lg={8}>
                                <Container component="main" maxWidth="xl">
                                <SignIn
                                    auth={auth}
                                    onSucess={(res) => {
                                        const auth = res.data;
                                        localStorage.setItem("accessToken", auth.jwtToken);
                                        localStorage.setItem("refreshToken", auth.refreshToken);

                                        setauth(auth);
                                        setreloadUserTable(true);
                                        setPage(0);
                                        history.replace(from);
                                    }}/>
                                </Container>
                            </Grid>
                        </Grid>
                        }
                    </Route>
                    <Route path={`/verify-email`}>
                        <Grid
                            container
                            direction="row"
                            justify="center"
                            alignItems="flex-start"
                        >
                            <Grid item xs={12} lg={4}>
                                <VerifyEmail/>
                            </Grid>
                        </Grid>
                    </Route>
                    <Route path={`/reset-password`}>
                        <Grid
                            container
                            direction="row"
                            justify="center"
                            alignItems="flex-start"
                        >
                            <Grid item xs={12} lg={4}>
                                <ResetPassword/>
                            </Grid>
                        </Grid>
                    </Route>
                    <Route path="/register">
                        <Grid
                            container
                            direction="row"
                            justify="center"
                            alignItems="flex-start"
                        >
                            <Grid item xs={12} lg={8}>
                                <Registration
                                    auth={auth}
                                    onSucess={(auth)=>{
                                        history.replace("/login");
                                    }}/>
                            </Grid>
                        </Grid>
                    </Route>
                    <Route path="/"
                           render={({ location }) =>
                               auth ? (
                                   <Grid
                                       container
                                       direction="row"
                                       justify="center"
                                       alignItems="flex-start"
                                   >
                                       {renderPage()}
                                   </Grid>
                               ) : (
                                   <Redirect
                                       to={{
                                           pathname: "/login",
                                           state: { from: location }
                                       }}
                                   />
                               )
                           }/>
                </Switch>
            {/*</Router>*/}

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
            {onNewIndex?<WristIndex func={api.func} open={onNewIndex} first={onNewIndex.firstRecord} viewMode={IndexView} handleCancel={handleCancelNewIndex} getOutputData={getOutputData} handleSubmit={handleSubmitNewIndex}/>:''}
            {onNewComment?<Comment open={onNewComment} viewMode={CommentView} handleCancel={handleCancelNewComment} getOutputData={getOutputData} handleSubmit={handleSubmitNewComment}/>:''}
            <Backdrop className={classes.backdrop} open={busy !== false}>
                <CircularProgress color="secondary"/>
                <span>{(busy || {text: ''}).text}</span>
            </Backdrop>
        </MuiThemeProvider>
    );
}


export default App;
