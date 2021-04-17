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
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import CancelIcon from '@material-ui/icons/Cancel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
    },
    AddButton :{
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

function UserInfo(props) {
    const classes = useStyles();
    const [data, setData] = React.useState({});
    const prevData = usePrevious(props.data);
    const [editMode, setEditMode] = React.useState(false);
    // const styleField = 'filled';
    const styleField = props.viewMode ? 'filled' : 'outlined';
    useEffect(()=>{
        // if (props.viewMode){
        //     debugger

        if ((props.data!==prevData)){
            console.log('update info user!')
            setData({...props.data}??{});
            setEditMode(false);
        }
        // }
    });
    const handleChange = (event) => {
        const name = event.target.name;
        data[name] = event.target.value;
        setData({...data});
    };
    const onMouseOver = props.onMouseOver??(()=>{});
    const renderButtonUserInfo = () =>{
        console.log(data["Hand dominance"])
        if (props.viewMode)
            return '';
        if (props.userEditMode || editMode)
            return <>
                {editMode?<Button
                    className={classes.AddButton}
                    variant="contained"
                    color="secondary"
                    size="small"
                    startIcon={<CancelIcon />}
                    onClick={()=>{setEditMode(false);setData({...props.data}??{})}}
                >
                    Cancel
                </Button>:''}
                <Button
                className={classes.AddButton}
                variant="contained"
                color="primary"
                size="small"
                startIcon={<SaveIcon />}
                onClick={()=>props.handleSubmitPatient(data)}
            >
                Save
            </Button></>;
        return <Button
            className={classes.AddButton}
            variant="contained"
            color="primary"
            size="small"
            startIcon={<SaveIcon />}
            onClick={()=>setEditMode(true)}
        >
            Edit
        </Button>
    }
    return (
        <>
            <Paper className={classes.paper}>
                <form className={classes.root} noValidate autoComplete="off">
                    <h2>Patient Data {renderButtonUserInfo()}</h2>
                    <Grid container spacing={0.5} direction="column"
                          justify="center"
                          alignItems="stretch">
                        <Grid item xs>
                            <TextField disabled
                                       InputLabelProps={{shrink: true}}
                                       value={data['_id']} fullWidth margin="dense" label="Patient's Case Number"
                                       name="_id"
                                       onChange={handleChange} variant={styleField}/>
                        </Grid>
                        <Grid item xs>
                            <TextField disabled={props.viewMode || !((props.userEditMode || editMode))}
                                       InputLabelProps={{shrink: true}}
                                       value={data['Initials']} fullWidth margin="dense" label="Patient's Initials"
                                       name="Initials"
                                       onChange={handleChange} variant={styleField}/>
                        </Grid>
                        <Grid item xs container direction="row">
                            <Grid item xs={6}>
                                <TextField disabled={props.viewMode || !((props.userEditMode || editMode))} type="date"
                                           InputLabelProps={{shrink: true}}
                                           value={data['Date of Birth']} fullWidth margin="dense" label="Date of Birth"
                                           name="Date of Birth" onChange={handleChange} variant={styleField}/>
                            </Grid>
                            <Grid item xs={6}>
                                <TextField disabled={props.viewMode || !((props.userEditMode || editMode))} select
                                           InputLabelProps={{shrink: true}}
                                           value={data['Gender']??""} fullWidth margin="dense" label="Gender" name="Gender"
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
                            <TextField disabled={props.viewMode || !((props.userEditMode || editMode))} type="date"
                                       InputLabelProps={{shrink: true}}
                                       value={data['Date of Injury']} fullWidth margin="dense"
                                       label="Date of Injury/ onset of condition" name="Date of Injury"
                                       onChange={handleChange} variant={styleField}/>
                        </Grid>
                        <Grid item xs container direction="row">
                            <Grid item xs>
                                <TextField disabled={props.viewMode || !((props.userEditMode || editMode))} select
                                           InputLabelProps={{shrink: true}}
                                           value={data['Hand dominance']??""} fullWidth margin="dense"
                                           label="Hand dominance" name="Hand dominance"
                                           onChange={handleChange} variant={styleField}>
                                    <MenuItem key="R" value="R">R</MenuItem>
                                    <MenuItem key="L" value="L">L</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item xs>
                                <TextField disabled={props.viewMode || !((props.userEditMode || editMode))} select
                                           InputLabelProps={{shrink: true}}
                                           value={data['Involved Side']??""}
                                           fullWidth margin="dense" label="Involved Side"
                                           name="Involved Side"
                                           onChange={handleChange} variant={styleField}>
                                    <MenuItem value="R">R</MenuItem>
                                    <MenuItem value="L">L</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item xs>
                                <TextField disabled={props.viewMode || !((props.userEditMode || editMode))} select
                                           InputLabelProps={{shrink: true}}
                                           value={data['Contralateral Side']??""} fullWidth margin="dense"
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
                            <TextField disabled={props.viewMode || !((props.userEditMode || editMode))} select
                                       InputLabelProps={{shrink: true}}
                                       value={data['Evaluators Profession']??""} fullWidth margin="dense"
                                       label="Evaluators Profession" name="Evaluators Profession"
                                       onChange={handleChange} variant={styleField}>
                                <MenuItem value="Surgeon">Surgeon</MenuItem>
                                <MenuItem value="Therapist">Therapist</MenuItem>
                            </TextField>
                        </Grid>
                        </Grid>
                    </Grid>
                    {props.userEditMode?'':<><h2>Wrist Index {(props.viewMode && !props.IndexEditMode)?'':<Button
                        variant="contained"
                        color="primary"
                        size="small"
                        className={classes.AddButton}
                        startIcon={<AddIcon />}
                        onClick={()=>props.newIndex(data['prefill'])}
                    >
                        New
                    </Button>}</h2>
                    {(!(data['Wrist Index']&&data['Wrist Index'].length)) ?<span>No record! Please add data</span>:
                        <TableContainer className={classes.container}>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Dates of Evaluations</TableCell>
                                        <TableCell>Has patient return to work?</TableCell>
                                        {props.IndexEditMode?<TableCell></TableCell>:''}
                                    </TableRow>
                                </TableHead>

                            <TableBody>
                                {data['Wrist Index'].map(d=><TableRow hover onMouseOver={()=>{onMouseOver(d._id)}} onMouseLeave={()=>onMouseOver(undefined)}>
                                    <TableCell style={{color: props.colors?props.colors(d._id):'unset'}}>
                                        {d['Date']}
                                    </TableCell>
                                    <TableCell style={{color: props.colors?props.colors(d._id):'unset'}}>
                                        {d['isReturnToWork']}
                                    </TableCell>
                                    {props.IndexEditMode?<TableCell key='btnCell' align="middle">
                                        <IconButton aria-label="view"  size="small" onClick={()=>props.viewIndex(d)}>
                                            <VisibilityIcon fontSize="inherit"/>
                                        </IconButton>
                                        <IconButton  aria-label="edit" size="small" onClick={()=>props.editIndex(d)}>
                                            <EditIcon fontSize="inherit"/>
                                        </IconButton>
                                        <IconButton color="secondary" aria-label="delete"  size="small" onClick={()=>props.deleteIndex(d)}>
                                            <DeleteIcon fontSize="inherit"/>
                                        </IconButton>
                                    </TableCell>:''}
                                </TableRow>)}
                            </TableBody>
                            </Table>
                        </TableContainer>
                    }</>
                    }
                </form>
            </Paper>
        </>
    );
}

export default UserInfo;
