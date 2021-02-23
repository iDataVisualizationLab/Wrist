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
        if (props.viewMode) {
            setData(this.props.data)
        }
    });
    const getOutputData = ()=>{
        Object.keys(data).forEach(k=>data[k].result = props.func[k](data[k]['Involved Hand'],data[k]['Contra-lateral Hand']));
        props.getOutputData({...data});
    };
    const handleChange = (event, mainKey, subKey, index) => {
        data[mainKey][subKey][index] = event.target.value;
        setData({...data});
    };
    const getData = (mainKey, subKey, index) => {
        return data[mainKey][subKey][index]
    };

    const sectionRender = (d) => {
        return (<>
            {d.sub.map((e, i) => <Grid item xs container direction="row" alignItems="center" spacing={1}>
                <Grid item xs>
                    <span>{e.text}</span>
                </Grid>
                <Grid item className={classes.input}>
                    <TextField disabled={props.viewMode} type="number"
                               InputLabelProps={{shrink: true}}
                               inputProps={{style: { textAlign: 'right'}}}
                               margin="dense"
                               size="small"
                               value={getData(d['key'], 'Involved Hand', i)} fullWidth margin="dense"
                               onChange={(event) => handleChange(event, d['key'], 'Involved Hand', i)}
                               variant={styleField}/>
                </Grid>
                <Grid item className={classes.input}>
                    <TextField disabled={props.viewMode} type="number"
                               InputLabelProps={{shrink: true}}
                               inputProps={{style: { textAlign: 'right'}}}
                               margin="dense"
                               size="small"
                               value={getData(d['key'], 'Contra-lateral Hand', i)} fullWidth margin="dense"
                               onChange={(event) => handleChange(event, d['key'], 'Contra-lateral Hand', i)}
                               variant={styleField}/>
                </Grid>
            </Grid>)}
            <Grid item xs container direction="row" alignItems="center" spacing={1} className={classes.funcResult}>
                <Grid item xs>
                    <span>{d['key']}</span>
                </Grid>
                {/*<Grid item className={classes.input}>*/}
                {/*    <span className={classes.func}>{props.func[d['key']](data[d['key']]['Involved Hand'])}</span>*/}
                {/*</Grid>*/}
                {/*<Grid item className={classes.input}>*/}
                {/*    <span className={classes.func}>{props.func[d['key']](data[d['key']]['Contra-lateral Hand'])}</span>*/}
                {/*</Grid>*/}
                <Grid item className={classes.input2}>
                    <span className={classes.func}>{props.func[d['key']](data[d['key']]['Involved Hand'],data[d['key']]['Contra-lateral Hand'])}</span>
                </Grid>
            </Grid></>)
    };
    const sectionRender2 = (d) => {
        return (<>
            {d.sub.map((e, i) => <Grid item xs container direction="row" alignItems="center" spacing={1}>
                <Grid item xs>
                    <span>{e.text}</span>
                </Grid>
                <Grid item className={classes.input}>
                    <TextField disabled={props.viewMode} type="number"
                               InputLabelProps={{shrink: true}}
                               inputProps={{style: { textAlign: 'right'}}}
                               margin="dense"
                               size="small"
                               value={getData(d['key'], 'Involved Hand', i)} fullWidth margin="dense"
                               onChange={(event) => handleChange(event, d['key'], 'Involved Hand', i)}
                               variant={styleField}/>
                </Grid>
                <Grid item className={classes.input}>
                    <TextField disabled={props.viewMode} type="number"
                               InputLabelProps={{shrink: true}}
                               inputProps={{style: { textAlign: 'right'}}}
                               margin="dense"
                               size="small"
                               value={getData(d['key'], 'Contra-lateral Hand', i)} fullWidth margin="dense"
                               onChange={(event) => handleChange(event, d['key'], 'Contra-lateral Hand', i)}
                               variant={styleField}/>
                </Grid>
            </Grid>)}
            <Grid item xs container direction="row" alignItems="center" spacing={1} className={classes.funcResult}>
                <Grid item xs>
                    <span>{d['key']}</span>
                </Grid>
                <Grid item className={classes.input2}>
                    <span className={classes.func}>{props.func[d['key']](data[d['key']]['Involved Hand'],data[d['key']]['Contra-lateral Hand'])}</span>
                </Grid>
            </Grid></>)
    };
    getOutputData();
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
        {[{key: 'TAM EX-0-Flex', sub: [{text: 'Extension'}, {text: 'Flexion'}]},
            {key: 'TAM Pro-0-Sup', sub: [{text: 'Pronation'}, {text: 'Supination'}]},
            {key: 'TAM Rad-0-Ulnar', sub: [{text: 'Radial Deviation'}, {text: 'Ulnar Deviation'}]}].map(sectionRender)}
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
        {[{key: 'Mean of 3 Trials', sub: [{text: 'Forearm Neutral 1'}, {text: 'Forearm Neutral 2'}, {text: 'Forearm Neutral 3'}]}].map(sectionRender)}
        {[{key: 'Grip Strength Supination Ratio', sub: [{text: 'Forearm Supination'}]}].map(sectionRender2)}
        {[{key: 'Grip Strength Pronation Ratio', sub: [{text: 'Forearm Pronation'}]}].map(sectionRender2)}
    </Grid>)
}

export default ObjectiveMeasurement;
