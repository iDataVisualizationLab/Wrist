import React, {useEffect, useRef} from "react";
import {
    TextField,
    Paper, Table, TableHead, TableRow, TableContainer, TableBody, TableCell
} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import {makeStyles} from '@material-ui/core/styles';
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import AddIcon from '@material-ui/icons/Add';
import SaveIcon from '@material-ui/icons/Save';
import IconButton from "@material-ui/core/IconButton";
import VisibilityIcon from "@material-ui/icons/Visibility";
import ChatIcon from '@material-ui/icons/Chat';
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import CancelIcon from '@material-ui/icons/Cancel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import WristViz from "./Wrist/wristViz";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Moment from 'moment';
import Tooltip from "@material-ui/core/Tooltip";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
    },
    AddButton: {
        float: 'right'
    }
}));

function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
}

const displayCol = ["PSFS score", "PRWE Pain Scale", "PRWE Function subscale", "SANE score", "MHQ score", "Wrist range motion Flexion/Extension", "Wrist range motion Pronation/Supination", "Wrist range motion Radial / Ulnar Deviation", "Grip Strength Ratio", "Grip Strength Supination Ratio", "Grip Strength Pronation Ratio"];

function UserInfo(props) {
    const classes = useStyles();
    const [data, setData] = React.useState({});
    const prevData = usePrevious(props.data);
    const [editMode, setEditMode] = React.useState(false);
    // const styleField = 'filled';
    const styleField = props.viewMode ? 'filled' : 'outlined';
    useEffect(() => {
        // if (props.viewMode){
        //     debugger

        if ((props.data !== prevData)) {
            setData({...props.data} ?? {});
            setEditMode(false);
        }
        // }
    });
    const handleChange = (event) => {
        const name = event.target.name;
        data[name] = event.target.value;
        setData({...data});
    };
    const onMouseOver = props.onMouseOver ?? (() => {
    });
    const renderButtonUserInfo = () => {
        console.log(data["Hand dominance"])
        if (props.viewMode)
            return '';
        if (props.userEditMode || editMode)
            return <>
                {editMode ? <Button
                    className={classes.AddButton}
                    variant="contained"
                    color="secondary"
                    size="small"
                    startIcon={<CancelIcon/>}
                    onClick={() => {
                        setEditMode(false);
                        setData({...props.data} ?? {})
                    }}
                >
                    Cancel
                </Button> : ''}
                <Button
                    className={classes.AddButton}
                    variant="contained"
                    color="primary"
                    size="small"
                    startIcon={<SaveIcon/>}
                    onClick={() => props.handleSubmitPatient(data)}
                >
                    Save
                </Button></>;
        return <Button
            className={classes.AddButton}
            variant="contained"
            color="primary"
            size="small"
            startIcon={<SaveIcon/>}
            onClick={() => setEditMode(true)}
        >
            Edit
        </Button>
    }
    const formatValue = (d) => {
        const value = ((typeof (d) === 'object') && d) ? d.result : d;
        const round = Math.round(value * 100) / 100;
        return (value !== round) ? round : value;
    }
    return (
        <Grid container spacing={1}
              justify="center"
              alignItems="stretch">
            <Grid item container xs={12}>
                <Grid item xs={props.userEditMode ? 12 : 6}>
                    <Paper className={classes.paper}>
                        <form className={classes.root} noValidate autoComplete="off">
                            <h2>Patient Data {renderButtonUserInfo()}</h2>
                            <Grid container spacing={0.5} direction="column"
                                  justify="center"
                                  alignItems="stretch">
                                <Grid item xs>
                                    <TextField disabled
                                               InputLabelProps={{shrink: true}}
                                               value={data['_id']} fullWidth margin="dense"
                                               label="Patient's Case Number"
                                               name="_id"
                                               onChange={handleChange} variant={styleField}/>
                                </Grid>
                                <Grid item xs>
                                    <TextField disabled={props.viewMode || !((props.userEditMode || editMode))}
                                               InputLabelProps={{shrink: true}}
                                               value={data['Initials']} fullWidth margin="dense"
                                               label="Patient's Initials"
                                               name="Initials"
                                               onChange={handleChange} variant={styleField}/>
                                </Grid>
                                <Grid item xs container direction="row">
                                    <Grid item xs={6}>
                                        <TextField disabled={props.viewMode || !((props.userEditMode || editMode))}
                                                   type="date"
                                                   InputLabelProps={{shrink: true}}
                                                   value={data['Date of Birth']&&Moment.utc(data['Date of Birth']).format('yyyy-MM-DD')} fullWidth margin="dense"
                                                   label="Date of Birth"
                                                   name="Date of Birth" onChange={handleChange} variant={styleField}/>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField disabled={props.viewMode || !((props.userEditMode || editMode))}
                                                   select
                                                   InputLabelProps={{shrink: true}}
                                                   value={data['Gender'] ?? ""} fullWidth margin="dense" label="Gender"
                                                   name="Gender"
                                                   onChange={handleChange} variant={styleField}>
                                            <MenuItem value="M">M</MenuItem>
                                            <MenuItem value="F">F</MenuItem>
                                        </TextField>
                                    </Grid>
                                </Grid>
                                <Grid item xs>
                                    <TextField disabled={props.viewMode || !((props.userEditMode || editMode))}
                                               InputLabelProps={{shrink: true}}
                                               multiline
                                               rows={4}
                                               value={data['Diagnosis']} fullWidth margin="dense" label="Diagnosis"
                                               name="Diagnosis"
                                               onChange={handleChange} variant={styleField}/>
                                </Grid>
                                <Grid item xs>
                                    <TextField disabled={props.viewMode || !((props.userEditMode || editMode))}
                                               type="date"
                                               InputLabelProps={{shrink: true}}
                                               value={data['Date of Injury']&&Moment.utc(data['Date of Injury']).format('yyyy-MM-DD')} fullWidth margin="dense"
                                               label="Date of Injury/ onset of condition" name="Date of Injury"
                                               onChange={handleChange} variant={styleField}/>
                                </Grid>
                                <Grid item xs container direction="row">
                                    <Grid item xs>
                                        <TextField disabled={props.viewMode || !((props.userEditMode || editMode))}
                                                   select
                                                   InputLabelProps={{shrink: true}}
                                                   value={data['Hand dominance'] ?? ""} fullWidth margin="dense"
                                                   label="Hand dominance" name="Hand dominance"
                                                   onChange={handleChange} variant={styleField}>
                                            <MenuItem key="R" value="R">R</MenuItem>
                                            <MenuItem key="L" value="L">L</MenuItem>
                                        </TextField>
                                    </Grid>
                                    <Grid item xs>
                                        <TextField disabled={props.viewMode || !((props.userEditMode || editMode))}
                                                   select
                                                   InputLabelProps={{shrink: true}}
                                                   value={data['Involved Side'] ?? ""}
                                                   fullWidth margin="dense" label="Involved Side"
                                                   name="Involved Side"
                                                   onChange={handleChange} variant={styleField}>
                                            <MenuItem value="R">R</MenuItem>
                                            <MenuItem value="L">L</MenuItem>
                                        </TextField>
                                    </Grid>
                                    <Grid item xs>
                                        <TextField disabled={props.viewMode || !((props.userEditMode || editMode))}
                                                   select
                                                   InputLabelProps={{shrink: true}}
                                                   value={data['Contralateral Side'] ?? ""} fullWidth margin="dense"
                                                   label="Contralateral Side involved?" name="Contralateral Side"
                                                   onChange={handleChange} variant={styleField}>
                                            <MenuItem value="Yes">Yes</MenuItem>
                                            <MenuItem value="No">No</MenuItem>
                                        </TextField>
                                    </Grid>
                                </Grid>
                                <Grid item xs>
                                    <TextField disabled={props.viewMode || !((props.userEditMode || editMode))}
                                               InputLabelProps={{shrink: true}}
                                               value={data['Profession']} fullWidth margin="dense"
                                               label="Patient's Profession" name="Profession"
                                               onChange={handleChange} variant={styleField}/>
                                </Grid>
                            </Grid>
                            <h2>Evaluator Data</h2>
                            <Grid container spacing={0.5} direction="column"
                                  justify="center"
                                  alignItems="stretch">
                                <Grid item xs container direction="row">
                                    <Grid item xs>
                                        <TextField disabled={props.viewMode || !((props.userEditMode || editMode))}
                                                   InputLabelProps={{shrink: true}}
                                                   value={data['Evaluators Initials']} fullWidth margin="dense"
                                                   label="Evaluator's Initials" name="Evaluators Initials"
                                                   onChange={handleChange} variant={styleField}/>
                                    </Grid>
                                    <Grid item xs>
                                        <TextField disabled={props.viewMode || !((props.userEditMode || editMode))}
                                                   select
                                                   InputLabelProps={{shrink: true}}
                                                   value={data['Evaluators Profession'] ?? ""} fullWidth margin="dense"
                                                   label="Evaluators Profession" name="Evaluators Profession"
                                                   onChange={handleChange} variant={styleField}>
                                            <MenuItem value="Surgeon">Surgeon</MenuItem>
                                            <MenuItem value="Therapist">Therapist</MenuItem>
                                        </TextField>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </form>
                    </Paper>
                </Grid>
                {props.userEditMode ? '' : <Grid item xs>
                    <WristViz onLoad={props.onLoad}
                              data={data['WristIndex']}
                              selectedIndex={props.selectedIndex}
                              colors={props.color}/>
                </Grid>}
            </Grid>
            {props.userEditMode ? '' : <Grid item xs={12}>
                <Paper className={classes.paper}>
                    <form className={classes.root} noValidate autoComplete="off">
                        <Grid container spacing={0.5} direction="column"
                              justify="center"
                              alignItems="stretch">
                            <h2>Wrist Index {(props.viewMode && !props.IndexEditMode) ? '' : <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                className={classes.AddButton}
                                startIcon={<AddIcon/>}
                                onClick={() => props.newIndex(data['prefill'], data['WristIndex'])}
                            >
                                New
                            </Button>}</h2>
                            {(!(data['WristIndex'] && data['WristIndex'].length)) ?
                                <span>No record! Please add data</span> :
                                <TableContainer className={classes.container}>
                                    <Table stickyHeader aria-label="sticky table"  size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Dates of Evaluations</TableCell>
                                                <TableCell>Has patient return to work?</TableCell>
                                                {displayCol.map(d => <TableCell key={d}>{d}</TableCell>)}
                                                <TableCell>Action</TableCell>
                                            </TableRow>
                                        </TableHead>

                                        <TableBody>
                                            {data['WristIndex'].map((d, i) => <TableRow hover onMouseOver={() => {
                                                onMouseOver(d._id)
                                            }} onMouseLeave={() => onMouseOver(undefined)}>
                                                <TableCell
                                                    style={{color: props.colors ? props.colors(d._id) : 'unset'}}>
                                                    {d['Date']&&Moment.utc(d['Date']).format('MM/DD/yyyy')}
                                                </TableCell>
                                                <TableCell
                                                    style={{color: props.colors ? props.colors(d._id) : 'unset'}}>
                                                    {d['isReturnToWork']}
                                                </TableCell>
                                                {displayCol.map(k => <TableCell key={k + i}
                                                                                align="right">{formatValue(d[k])}</TableCell>)}
                                                <TableCell key='btnCell' align="middle">
                                                    <ButtonGroup size="small">
                                                        <IconButton aria-label="view" size="small"
                                                                    onClick={() => props.viewIndex(d)}>
                                                            <VisibilityIcon fontSize="inherit"/>
                                                        </IconButton>
                                                        <IconButton aria-label="view" size="small"
                                                                    onClick={() => props.IndexEditMode ?props.editComment(d):props.viewComment(d)}>
                                                            {d.comment?<Tooltip title={d.comment.text} arrow><ChatIcon fontSize="inherit" color="primary"/></Tooltip>:
                                                                <ChatIcon fontSize="inherit"/>}
                                                        </IconButton>
                                                        {props.IndexEditMode ? <>
                                                            <IconButton aria-label="edit" size="small"
                                                                        onClick={() => props.editIndex(d)}>
                                                                <EditIcon fontSize="inherit"/>
                                                            </IconButton>
                                                            <IconButton color="secondary" aria-label="delete"
                                                                        size="small"
                                                                        onClick={() => props.deleteIndex(d)}>
                                                                <DeleteIcon fontSize="inherit"/>
                                                            </IconButton>
                                                        </>:''}
                                                    </ButtonGroup>
                                                </TableCell>
                                            </TableRow>)}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            }
                        </Grid>
                    </form>
                </Paper>
            </Grid>
            }
        </Grid>
    );
}

export default UserInfo;
