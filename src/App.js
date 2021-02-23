import React from 'react';
import {makeStyles, withStyles, MuiThemeProvider, createMuiTheme, fade} from '@material-ui/core/styles';
import './App.css';
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import ManageUser from "./components/manageUser";
import {AppBar, Toolbar, Typography, IconButton, Container} from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu';
import Grid from "@material-ui/core/Grid";
import UserInfo from "./components/userInfo";
import {sum, mean,count} from "d3";
import PROMs from "./components/PROMs";
import WristIndex from "./components/WristIndex";
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import * as axios from "axios";
import WristViz from "./components/wristViz";

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
    const [busy, setBusy] = React.useState(true);
    const [userData, setuserData] = React.useState({});
    const [userInfoView, setuserInfoView] = React.useState(false);
    const newIndexData = React.useRef({});
    const [onNewIndex, setonNewIndex] = React.useState(false);
    const [page, setPage] = React.useState(0);

    const onLoad = (d) => {
        if (d === undefined)
            setBusy(false);
        else
            setBusy(d)
    };

    const onAddNewUser = (d)=>{
        setuserInfoView(true);
    };

    const newPatient = (d)=>{
        setuserData({});
        setuserInfoView(false);
        setPage(1);
    };

    const viewPatient = (data)=>{
        const init = data['Initials'];
        const birth = data['Date of Birth'];
        const gender = data['Gender'];
        axios.get(`${((process.env.NODE_ENV === 'production')?process.env.REACT_APP_API_URL:process.env.REACT_APP_API_URL_LOCAL)}/patientProfile?init=${init}&birth=${birth}&gender=${gender}`)
            .then(r=>{
                debugger
                const d= r.data;
                setuserData(d);
                setPage(2);
                setuserInfoView(true);
            });
    };

    const newIndex = (d)=>{
        newIndexData.current = {};
        setonNewIndex(true);
    };

    const handleCancelNewIndex = (d)=>{
        setonNewIndex(false);
    };

    const getOutputData = (d)=>{
        Object.keys(d).forEach(k=>{
            newIndexData.current[k] = d[k];
        });
    }

    const handleSubmitNewIndex = ()=>{
        debugger;
        const init = userData['Initials'];
        const birth = userData['Date of Birth'];
        const gender = userData['Gender'];
        axios.post(`${((process.env.NODE_ENV === 'production')?process.env.REACT_APP_API_URL:process.env.REACT_APP_API_URL_LOCAL)}/record?init=${init}&birth=${birth}&gender=${gender}`,newIndexData.current)
            .then((r)=>{
                viewPatient(userData);
            }).catch(e=>{
            // handle error
        });
        setonNewIndex(false);
    };
    const handleSubmitPatient = (data)=>{
        axios.post(`${((process.env.NODE_ENV === 'production')?process.env.REACT_APP_API_URL:process.env.REACT_APP_API_URL_LOCAL)}/patientProfile`,data)
            .then(()=>{
                viewPatient(data);
            }).catch(e=>{
                // handle error
        })
    };

    const renderPage = ()=>{
        switch (page) {
            case 1:
                return <Grid item xs={4}>
                    <UserInfo viewMode={userInfoView} handleSubmitPatient={handleSubmitPatient} userEditMode={true} IndexEditMode={true} newIndex={newIndex} />

                </Grid>;
            case 2:
                return <><Grid item xs={4}>
                    <UserInfo data={userData} viewMode={userInfoView} userEditMode={!userInfoView} IndexEditMode={true} newIndex={newIndex} />
                </Grid>
                    <Grid item xs={6}>
                        <WristViz onLoad={onLoad} data={userData['Wrist Index']}/>
                    </Grid>
                    </>;
            default:
                return <Grid item xs={4}>
                    <ManageUser viewPatient={viewPatient} onLoad={onLoad} newPatient={newPatient}/>
                </Grid>;
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
                            {page?<ArrowBackIosIcon onClick={()=>setPage(0)}/>:''}
                        </IconButton>
                        <Typography className={classes.title} variant="h6" noWrap>
                            Wrist Index
                        </Typography>
                    </Toolbar>
                </AppBar>
            </div>
            <Grid
                container
                direction="row"
                justify="center"
                alignItems="flex-start"
            >
                {renderPage()}
            </Grid>
            <WristIndex func={func} open={onNewIndex} handleCancel={handleCancelNewIndex} getOutputData={getOutputData} handleSubmit={handleSubmitNewIndex}/>
            <Backdrop className={classes.backdrop} open={busy !== false}>
                <CircularProgress color="secondary"/>
                <span>{(busy || {text: ''}).text}</span>
            </Backdrop>
        </MuiThemeProvider>
    );
}

export default App;
