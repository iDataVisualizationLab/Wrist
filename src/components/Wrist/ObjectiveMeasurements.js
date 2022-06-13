import React, {useEffect} from "react";
import {
    TextField,
    Paper, Grid
} from "@material-ui/core";
import {makeStyles} from '@material-ui/core/styles';
import {sum, mean} from "d3"
import MenuItem from "@material-ui/core/MenuItem";
import Box from "@material-ui/core/Box";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    title:{
        backgroundColor: theme.palette.primary.light
    },
    input: {
        width: 200,
        textAlign: 'right',
        '& input::-webkit-inner-spin-button':{
            WebkitAppearance: 'none',
            margin: 0,
        }
    },
    input2: {
        width: 400,
        textAlign: 'center',
    },
    func: {
        paddingLeft: 14,
        paddingRight: 14,
        paddingTop: 10.5,
        paddingBottom: 10.5,
        lineHeight: '40px',
        marginTop: 8,
        marginBottom: 4
    },
    funcResult:{
        backgroundColor: '#ddd',
        marginBottom: theme.spacing(1),
        borderRadius: 20
    }
}));


function ObjectiveMeasurement(props) {
    const classes = useStyles();
    const styleField = props.viewMode ? 'filled' : 'outlined';
    const [data, setData] = React.useState({
        "TAM EX-0-Flex": {
            "Involved Hand": [0, 0],
            "Contra-lateral Hand": [0, 0],
            "result":0
        },
        "TAM Pro-0-Sup": {
            "Involved Hand": [0, 0],
            "Contra-lateral Hand": [0, 0],
            "result":0
        },
        "TAM Rad-0-Ulnar": {
            "Involved Hand": [0, 0],
            "Contra-lateral Hand": [0, 0],
            "result":0
        },
        "Mean of 3 Trials": {
            "Involved Hand": [0, 0, 0],
            "Contra-lateral Hand": [0, 0, 0],
            "result":0
        },
        "Grip Strength Supination Ratio": {
            "Involved Hand": [0],
            "Contra-lateral Hand": [0],
            "result":0
        },
        "Grip Strength Pronation Ratio": {
            "Involved Hand": [0],
            "Contra-lateral Hand": [0],
            "result":0
        }
    });
    useEffect(() => {
        let willupdate=false;
        const obj = {...data};
        Object.keys(data).forEach(k=>{
            debugger
            const v = props.getOutputData(k);
            if ( v){
                willupdate = true;
                obj[k] = v;
            }
        })
        if (willupdate) {
            setData(obj);
        }else{
            getOutputData();
        }
    },[]);
    const getOutputData = ()=>{
        Object.keys(data).forEach(k=>data[k].result = props.func[k](data[k]['Involved Hand'],data[k]['Contra-lateral Hand']));
        props.getOutputData({...data});
    };
    const handleChange = (event, mainKey, subKey, index,max) => {
        data[mainKey][subKey][index] = max?Math.min(max,+event.target.value):+event.target.value;
        data[mainKey].result = props.func[mainKey](data[mainKey]['Involved Hand'],data[mainKey]['Contra-lateral Hand']);
        setData({...data});
        props.getOutputData({...data})
    };
    const getData = (mainKey, subKey, index) => {
        return data[mainKey][subKey][index]
    };

    const sectionRender = (d,isopensecond,min) => {
        return (<>
            {d.sub.map((e, i) => <Grid item xs container direction="row" alignItems="center" spacing={1}>
                <Grid item xs>
                    <span>{e.text}</span>
                </Grid>
                <Grid item className={classes.input}>
                    <TextField disabled={props.viewMode} type="number"
                               InputLabelProps={{shrink: true}}
                               inputProps={{style: { textAlign: 'right'},max: 110}}
                               margin="dense"
                               size="small"
                               value={getData(d['key'], 'Involved Hand', i)} fullWidth margin="dense"
                               onChange={(event) => ((+event.target.value<min) && (min!==undefined))?0: handleChange(event, d['key'], 'Involved Hand', i,110)}
                               variant={styleField}/>
                </Grid>
                <Grid item className={classes.input}>
                    <TextField
                        // disabled={props.viewMode}
                        disabled={(props.first&&props.first[d['key']]&&!isopensecond)||props.viewMode}
                               type="number"
                               InputLabelProps={{shrink: true}}
                               inputProps={{style: { textAlign: 'right'},max: 110}}
                               margin="dense"
                               size="small"
                               value={getData(d['key'], 'Contra-lateral Hand', i)} fullWidth margin="dense"
                               onChange={(event) => ((+event.target.value<min) && (min!==undefined))?0:handleChange(event, d['key'], 'Contra-lateral Hand', i,110)}
                               variant={styleField}/>
                </Grid>
            </Grid>)}
            <Grid item xs container direction="row" alignItems="center" spacing={1} className={classes.funcResult}>
                <Grid item xs>
                    <span>{d['title']??d['key']}</span>
                </Grid>
                <Grid item className={classes.input2}>
                    <span className={classes.func}>{Math.round(data[d['key']].result*100)/100}</span>
                </Grid>
            </Grid></>)
    };
    const sectionRender2 = (d,openSecond) => {
        return (<>
            {d.sub.map((e, i) => <Grid item xs container direction="row" alignItems="center" spacing={1}>
                <Grid item xs>
                    <span>{e.text}</span>
                </Grid>
                <Grid item className={classes.input}>
                    <TextField disabled={props.viewMode} type="number"
                               InputLabelProps={{shrink: true}}
                               inputProps={{style: { textAlign: 'right'}, min:0}}
                               margin="dense"
                               size="small"
                               value={getData(d['key'], 'Involved Hand', i)} fullWidth margin="dense"
                               onChange={(event) => +event.target.value<0?0:handleChange(event, d['key'], 'Involved Hand', i)}
                               variant={styleField}/>
                </Grid>
                <Grid item className={classes.input}>
                    <TextField
                        // disabled={props.viewMode}
                        disabled={(props.first&&(!openSecond))||props.viewMode}
                        type="number"
                               InputLabelProps={{shrink: true}}
                               inputProps={{style: { textAlign: 'right'}, min:0}}
                               margin="dense"
                               size="small"
                               value={getData(d['key'], 'Contra-lateral Hand', i)} fullWidth margin="dense"
                               onChange={(event) => +event.target.value<0?0:handleChange(event, d['key'], 'Contra-lateral Hand', i)}
                               variant={styleField}/>
                </Grid>
            </Grid>)}
            <Grid item xs container direction="row" alignItems="center" spacing={1} className={classes.funcResult}>
                <Grid item xs>
                    <span>{d['key']}</span>
                </Grid>
                <Grid item className={classes.input2}>
                    <span className={classes.func}>{Math.round(data[d['key']].result*100)/100}</span>
                </Grid>
            </Grid></>)
    };
    // getOutputData();
    return (<Grid container spacing={0.5} direction="column"
                  justify="center"
                  alignItems="stretch">
        <h3 align='center' className={classes.title}>Wrist Range of Motion</h3>
        <Grid item xs container direction="row" spacing={1}>
            <Grid item xs>
            </Grid>
            <Grid item className={classes.input}>
                <Box fontWeight="fontWeightBold">
                    Involved Hand
                </Box>
            </Grid>
            <Grid item className={classes.input}>
                <Box fontWeight="fontWeightBold">
                    Contra-lateral Hand
                </Box>
            </Grid>
        </Grid>
        {[{key: 'TAM EX-0-Flex',title:'Ratio EX-0-Flex', sub: [{text: 'Extension'}, {text: 'Flexion'}]},
            {key: 'TAM Pro-0-Sup',title:'Ratio Pro-0-Sup', sub: [{text: 'Pronation'}, {text: 'Supination'}]},
            {key: 'TAM Rad-0-Ulnar',title:'Ratio Rad-0-Ulnar', sub: [{text: 'Radial Deviation'}, {text: 'Ulnar Deviation'}]}].map(d=>sectionRender(d))}
        <h3 align='center' className={classes.title}>Gripstrength (Dynamometer, Position II)</h3>
        <Grid item xs container direction="row" spacing={1}>
            <Grid item xs>
                <Box fontWeight="fontWeightBold">
                    Measurements in Kg
                </Box>
            </Grid>
            <Grid item className={classes.input}>
                <Box fontWeight="fontWeightBold">
                    Involved Hand
                </Box>
            </Grid>
            <Grid item className={classes.input}>
                <Box fontWeight="fontWeightBold">
                    Contra-lateral Hand
                </Box>
            </Grid>
        </Grid>
        {[{key: 'Mean of 3 Trials',title:'Ratio mean of 3 Trials', sub: [{text: 'Forearm Neutral 1'}, {text: 'Forearm Neutral 2'}, {text: 'Forearm Neutral 3'}]}].map(d=>sectionRender(d,true,0))}
        {[{key: 'Grip Strength Supination Ratio', sub: [{text: 'Forearm Supination'}]}].map(d=>sectionRender2(d,true))}
        {[{key: 'Grip Strength Pronation Ratio', sub: [{text: 'Forearm Pronation'}]}].map(d=>sectionRender2(d,true))}
    </Grid>)
}

export default ObjectiveMeasurement;
