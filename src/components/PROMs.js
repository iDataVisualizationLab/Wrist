import React, {useEffect} from "react";
import {
    TextField,
    Paper, Grid
} from "@material-ui/core";
import {makeStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@material-ui/icons/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@material-ui/icons/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@material-ui/icons/SentimentSatisfiedAltOutlined';
import SentimentVerySatisfiedIcon from '@material-ui/icons/SentimentVerySatisfied';
import * as d3 from "d3"
import RadioChoice from "./radioChoice";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Input from "@material-ui/core/Input";
import Divider from "@material-ui/core/Divider";
import FormControl from "@material-ui/core/FormControl";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    header: {
        marginBlockEnd: theme.spacing(1)
    },
    subheader: {
        marginBlockStart: theme.spacing(2),
        marginBlockEnd: theme.spacing(1),
    },
    result: {
        backgroundColor: 'yellow'
    }
}));

const Template = {
    PSFS: ['Doing a push up as an exercise', 'Lifting a heavy pan in the kitchen', 'Making scrambled eggs'],
    PRWE: ['At rest', 'doing a task with a repeated wrist / hand movement', 'lifting a heavy object', 'it is at its worst', 'How often do you have pain? (0= never - 10= always)',
        'Fasten buttons on your shirt', 'Cut meat (or vegetables) using a knife', 'Turn a door knob with your affected hand', 'Use your affected wrist / hand to push up from a chair', 'Carry a heavy object in your affected  hand', 'Use bathroom tissue with your affected  hand',
        'Personal care activities (dressing, washing)', 'Household work (cleaning, maintenance)', 'Work (your job or other work)', 'Recreational activities',
        'How important is the appearance of your hand?', 'How much did the appearance of your wrist/hand bother you in the past week?',
        'How would you rate your injured hand / wrist / hand  on a scale of 0-100? 100 is normal'],
    MHQ: ['How often were you unable to do your work because of problems with your hand(s)/wrist / hand(s)?', 'How often did you have to shorten your work day because of problems with your hand(s)/ wrist / hand(s)?',
        'How often did you have to take it easy at your work because of problems with your hand(s)/ wrist / hand(s)?', 'How often did you accomplish less in your work because of problems with your hand(s)/ wrist / hand(s)?',
        'How often did you take longer to do the tasks in your work because of problems with your hand(s)/ wrist / hand(s)?']
}

function PROMs(props) {
    const classes = useStyles();
    const {func} = props;
    const [Action, setAction] = React.useState(new Array(3));
    const [PSFS, setPSFS] = React.useState(new Array(3));
    const [PRWE, setPRWE] = React.useState(new Array(17));
    const [MHQ, setMHQ] = React.useState(new Array(5));

    const handleAction= (val, index) => {
        Action[index] = val;
        setAction([...Action]);
        props.getOutputData({Action});
    };
    const handlePSFS = (val, index) => {
            PSFS[index] = val;
            setPSFS([...PSFS]);
            props.getOutputData({PSFS, 'PSFS score': func['PSFS score'](PSFS)});
        };

    const handlePRWE = (val, index) => {
        PRWE[index] = val;
        setPRWE([...PRWE]);
        props.getOutputData({
            PRWE,
            'PRWE Pain Scale': func['PRWE Pain Scale'](PRWE),
            'PRWE Function subscale': func['PRWE Function subscale'](PRWE),
            'SANE score': func['SANE score'](PRWE)
        });
    };

    const handleMHQ = (val, index) => {
        MHQ[index] = val;
        setMHQ([...MHQ]);
        props.getOutputData({
            MHQ,
            'MHQ score': func['MHQ score'](MHQ),
        });
    };


    useEffect(() => {
        let willupdate = false;
        if (props.getOutputData('PSFS')) {
            willupdate = true;
            setPSFS(props.getOutputData('PSFS'));
        }
        if (props.getOutputData('PRWE')) {
            willupdate = true;
            setPRWE(props.getOutputData('PRWE'));
        }
        if (props.getOutputData('MHQ')) {
            willupdate = true;
            setMHQ(props.getOutputData('MHQ'));
        }
        if (props.getOutputData('Action')) {
            willupdate = true;
            setAction(props.getOutputData('Action'));
        }
        if (!willupdate) {
            props.getOutputData({
                PSFS, PRWE, MHQ, 'PSFS score': func['PSFS score'](PSFS),
                'PRWE Pain Scale': func['PRWE Pain Scale'](PRWE),
                'PRWE Function subscale': func['PRWE Function subscale'](PRWE),
                'SANE score': func['SANE score'](PRWE),
                'MHQ score': func['MHQ score'](MHQ),
            });
        }
    }, []);
    return (
        <Grid container spacing={2}
              justify="center"
              alignItems="stretch">
            <Grid item xs={12}>
                <h3 className={classes.header}>Patient Specific Functional Scale PSFS</h3>
                {Template.PSFS
                    .map((d, i) => <Grid item xs container direction="row" spacing="1" alignItems="center" key={i}>
                            <Grid item xs={8}>
                                {(props.first||props.viewMode)?Action[i]:<TextField
                                           InputLabelProps={{shrink: true}}
                                           margin="dense"
                                           size="small"
                                           value={Action[i]} fullWidth margin="dense"
                                           onChange={(event) => handleAction(event.target.value, i)}
                                           />}
                            </Grid>
                            <Grid item xs={4}>
                                <RadioChoice max={10} value={PSFS[i]} name={"PSFS" + i}
                                             handeData={function (val) {
                                                 handlePSFS(val, i)
                                             }} disabled={props.viewMode||(!Action[i])}/>
                            </Grid>
                        </Grid>
                    )
                }
                <Grid item xs container direction="row" spacing="1" alignItems="center" className={classes.result}>
                    <Grid item xs={8}>PSFS Average Score for Items</Grid>
                    <Grid item xs={4}>
                        {d3.mean(PSFS)}
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <h3 className={classes.header}>Patient Rated wrist / wrist / hand Evaluation PRWE </h3>
                <h4 className={classes.subheader}>Pain when… </h4>
                {Template.PRWE.slice(0, 5).map((d, i) => <Grid item xs container direction="row" spacing="1"
                                                               alignItems="center">
                        <Grid item xs={8}>{d}</Grid>
                        <Grid item xs={4}>
                            <RadioChoice max={10} value={PRWE[i]} name={"PRWE" + i}
                                         handeData={function (val) {
                                             handlePRWE(val, i)
                                         }} disabled={props.viewMode}/>
                        </Grid>
                    </Grid>
                )}
                <Grid item xs container direction="row" spacing="1" alignItems="center" className={classes.result}>
                    <Grid item xs={8}>PRWE Pain Score</Grid>
                    <Grid item xs={4}>
                        {d3.sum(PRWE.slice(0, 5))}
                    </Grid>
                </Grid>
                <h4 className={classes.subheader}>Function</h4>
                {Template.PRWE.slice(5, 11)
                    .map((d, _i) => {
                            const i = _i + 5
                            return <Grid item xs container direction="row" spacing="1" alignItems="center">
                                <Grid item xs={8}>{d}</Grid>
                                <Grid item xs={4}>
                                    <RadioChoice max={10} value={PRWE[i]} name={"PRWE" + i}
                                                 handeData={function (val) {
                                                     handlePRWE(val, i)
                                                 }} disabled={props.viewMode}/>
                                </Grid>
                            </Grid>
                        }
                    )
                }
                <h4 className={classes.subheader}>Usual activities</h4>
                {Template.PRWE.slice(11, 15)
                    .map((d, _i) => {
                            const i = _i + 11;
                            return <Grid item xs container direction="row" spacing="1" alignItems="center">
                                <Grid item xs={8}>{d}</Grid>
                                <Grid item xs={4}>
                                    <RadioChoice max={10} value={PRWE[i]} name={"PRWE" + i}
                                                 handeData={function (val) {
                                                     handlePRWE(val, i)
                                                 }} disabled={props.viewMode}/>
                                </Grid>
                            </Grid>
                        }
                    )
                }
                <Grid item xs container direction="row" spacing="1" alignItems="center" className={classes.result}>
                    <Grid item xs={8}>PRWE Function Score</Grid>
                    <Grid item xs={4}>
                        {(d3.sum(PRWE.slice(5, 15)) + (10 - d3.count(PRWE.slice(5, 15))) * d3.mean(PRWE.slice(5, 15))) / 2}
                    </Grid>
                </Grid>
                <h4 className={classes.subheader}>PRWHE appearance - optional</h4>
                <Grid item xs container direction="row" spacing="1" alignItems="center">
                    <Grid item xs={8}>{Template.PRWE[15]}</Grid>
                    <Grid item xs={4}>
                        <Select
                            displayEmpty
                            variant="outlined"
                            fullWidth
                            margin="dense"
                            value={PRWE[15]}
                            disabled={props.viewMode}
                            onChange={(event) => handlePRWE(+event.target.value, 15)}>
                            <MenuItem value={0}>Very Much</MenuItem>
                            <MenuItem value={1}>Somewhat</MenuItem>
                            <MenuItem value={2}>Not at all</MenuItem>
                        </Select>
                    </Grid>
                </Grid>
                <Grid item xs container direction="row" spacing="1" alignItems="center">
                    <Grid item xs={8}>{Template.PRWE[16]}</Grid>
                    <Grid item xs={4}>
                        <RadioChoice max={10} value={PRWE[16]} name={"PRWE" + 16}
                                     handeData={function (val) {
                                         handlePRWE(val, 16)
                                     }} disabled={props.viewMode}/>
                    </Grid>
                </Grid>
                <h4 className={classes.subheader}>Single Answer Numeric Evaluation SANE (adapted to hand and wrist /
                    hand) </h4>
                <Grid item xs container direction="row" spacing="1" alignItems="center">
                    <Grid item xs={8}>{Template.PRWE[17]}</Grid>
                    <Grid item xs={4}>
                        <TextField
                            type="number"
                            InputProps={{inputProps: {min: 0, max: 100}}}
                            disabled={props.viewMode}
                            value={PRWE[17]}
                            variant={"outlined"}
                            margin={"dense"}
                            onChange={(event) => handlePRWE((+event.target.value), 17)}
                        >

                        </TextField>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <h3 className={classes.header}>Michigan Hand Questionnaire MHQ work module</h3>
                {Template.MHQ
                    .map((d, i) => <Grid item xs container direction="row" spacing="1" alignItems="center">
                            <Grid item xs={8}>{d}</Grid>
                            <Grid item xs={4}>
                                <RadioChoice min={1} max={5} value={MHQ[i]} precision={1} name={"MHQ" + i}
                                             handeData={function (val) {
                                                 handleMHQ(val, i)
                                             }} disabled={props.viewMode}/>
                            </Grid>
                        </Grid>
                    )
                }
                <Grid item xs container direction="row" spacing="1" alignItems="center" className={classes.result}>
                    <Grid item xs={8}>Raw Score for MHQ work module </Grid>
                    <Grid item xs={4}>
                        {d3.sum(MHQ)}
                    </Grid>
                </Grid>
                <Grid item xs container direction="row" spacing="1" alignItems="center" className={classes.result}>
                    <Grid item xs={8}>MHQ Algorithm calculated score</Grid>
                    <Grid item xs={4}>
                        {(d3.sum(MHQ) - 5) / 20 * 100}
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default PROMs;
