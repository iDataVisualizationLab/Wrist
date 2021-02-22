import React, {useEffect} from "react";
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

function UserInfo(props) {
    const classes = useStyles();
    const [data, setData] = React.useState({});
    // const styleField = 'filled';
    const styleField = props.viewMode ? 'filled' : 'outlined';
    useEffect(()=>{
        if (props.viewMode){
            debugger
            setData(props.data??{});
            console.log(props.data)
        }
    });
    const handleChange = (event) => {
        const name = event.target.name;
        data[name] = event.target.value;
        setData(data);
    };
    return (
        <>
            <Paper className={classes.paper}>
                <form className={classes.root} noValidate autoComplete="off">
                    <h2>Patient Data {props.userEditMode?<Button
                        className={classes.AddButton}
                        variant="contained"
                        color="primary"
                        size="small"
                        startIcon={<SaveIcon />}
                        onClick={()=>props.handleSubmitPatient(data)}
                    >
                        Save
                    </Button>:''}</h2>
                    <Grid container spacing={0.5} direction="column"
                          justify="center"
                          alignItems="stretch">
                        <Grid item xs>
                            <TextField disabled={props.viewMode}
                                       InputLabelProps={{shrink: true}}
                                       value={data['Initials']} fullWidth margin="dense" label="Patient's Initials"
                                       name="Initials"
                                       onChange={handleChange} variant={styleField}/>
                        </Grid>
                        <Grid item xs container direction="row">
                            <Grid item xs={6}>
                                <TextField disabled={props.viewMode} type="date"
                                           InputLabelProps={{shrink: true}}
                                           value={data['Date of Birth']} fullWidth margin="dense" label="Date of Birth"
                                           name="Date of Birth" onChange={handleChange} variant={styleField}/>
                            </Grid>
                            <Grid item xs={6}>
                                <TextField disabled={props.viewMode} select
                                           InputLabelProps={{shrink: true}}
                                           value={data['Gender']} fullWidth margin="dense" label="Gender" name="Gender"
                                           onChange={handleChange} variant={styleField}>
                                    <MenuItem value="M">M</MenuItem>
                                    <MenuItem value="F">F</MenuItem>
                                </TextField>
                            </Grid>
                        </Grid>
                        <Grid item xs>
                            <TextField disabled={props.viewMode}
                                       InputLabelProps={{shrink: true}}
                                       multiline
                                       rows={4}
                                       value={data['Diagnosis']} fullWidth margin="dense" label="Diagnosis"
                                       name="Diagnosis"
                                       onChange={handleChange} variant={styleField}/>
                        </Grid>
                        <Grid item xs>
                            <TextField disabled={props.viewMode} type="date"
                                       InputLabelProps={{shrink: true}}
                                       value={data['Date of Injury']} fullWidth margin="dense"
                                       label="Date of Injury/ onset of condition" name="Date of Injury"
                                       onChange={handleChange} variant={styleField}/>
                        </Grid>
                        <Grid item xs container direction="row">
                            <Grid item xs>
                                <TextField disabled={props.viewMode} select
                                           InputLabelProps={{shrink: true}}
                                           value={data['Hand dominance']} fullWidth margin="dense"
                                           label="Hand dominance" name="Hand dominance"
                                           onChange={handleChange} variant={styleField}>
                                    <MenuItem value="R">R</MenuItem>
                                    <MenuItem value="L">L</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item xs>
                                <TextField disabled={props.viewMode} select
                                           InputLabelProps={{shrink: true}}
                                           value={data['Involved Side']} fullWidth margin="dense" label="Involved Side"
                                           name="Involved Side"
                                           onChange={handleChange} variant={styleField}>
                                    <MenuItem value="R">R</MenuItem>
                                    <MenuItem value="L">L</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item xs>
                                <TextField disabled={props.viewMode} select
                                           InputLabelProps={{shrink: true}}
                                           value={data['Contralateral Side']} fullWidth margin="dense"
                                           label="Contralateral Side involved?" name="Contralateral Side"
                                           onChange={handleChange} variant={styleField}>
                                    <MenuItem value="Yes">Yes</MenuItem>
                                    <MenuItem value="No">No</MenuItem>
                                </TextField>
                            </Grid>
                        </Grid>
                        <Grid item xs>
                            <TextField disabled={props.viewMode}
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
                            <TextField disabled={props.viewMode}
                                       InputLabelProps={{shrink: true}}
                                       value={data['Evaluators Initials']} fullWidth margin="dense"
                                       label="Evaluator's Initials" name="Evaluators Initials"
                                       onChange={handleChange} variant={styleField}/>
                        </Grid>
                        <Grid item xs>
                            <TextField disabled={props.viewMode} select
                                       InputLabelProps={{shrink: true}}
                                       value={data['Evaluators Profession']} fullWidth margin="dense"
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
                        onClick={props.newIndex}
                    >
                        New
                    </Button>}</h2>
                    {!data['Wrist Index'] ?<span>No record! Please add data</span>:
                        <TableContainer className={classes.container}>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Dates of Evaluations</TableCell>
                                        <TableCell>Has patient return to work?</TableCell>
                                    </TableRow>
                                </TableHead>
                            </Table>
                            <TableBody>
                                {data['Wrist Index'].map(d=><TableRow>
                                    <TableCell>
                                        {d['Date']}
                                    </TableCell>
                                    <TableCell>
                                        {d['isReturnToWork']}
                                    </TableCell>
                                </TableRow>)}
                            </TableBody>
                        </TableContainer>
                    }</>
                    }
                </form>
            </Paper>
        </>
    );
}

export default UserInfo;
