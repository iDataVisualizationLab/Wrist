import React, {useEffect} from 'react';
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import {makeStyles, withStyles, MuiThemeProvider, createMuiTheme, fade} from '@material-ui/core/styles';
import axios from "axios";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import Stepper from "@material-ui/core/Stepper";
import Typography from "@material-ui/core/Typography";
import Step from "@material-ui/core/Step";
import StepLabel from '@material-ui/core/StepLabel';
import PROMs from "./PROMs";
import MenuItem from "@material-ui/core/MenuItem";
import ObjectiveMeasurement from "./ObjectiveMeasurements";

const useStyles = makeStyles((theme) => ({
    backButton: {
        marginRight: theme.spacing(1),
    },
    instructions: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
}));

function getSteps() {
    return ['General Information', 'Objective Measurements', 'PROMs'];
}

function getStepContent(step,props) {
    switch (step) {
        case 0:
            return <Grid container>
                <Grid item xs>
                    <TextField type="date"
                               InputLabelProps={{shrink: true}}
                               fullWidth margin="dense"
                               label="Date of Evaluation" name="Date"
                               onChange={props.handleChange} variant="outlined"/>

                </Grid>
                <Grid item xs>
                    <TextField select
                               fullWidth margin="dense"
                               label="Has patient returned to work?" name="isReturnToWork"
                               onChange={props.handleChange} variant="outlined">
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                    </TextField>
                </Grid>
            </Grid>;
        case 1:
            return <ObjectiveMeasurement {...props}/>;
        case 2:
            return <PROMs {...props}/>;
        default:
            return 'Unknown step';
    }
}

function WristIndex(props) {
    const classes = useStyles();
    const {handleSubmit,handleCancel,open} = props;
    const [activeStep, setActiveStep] = React.useState(0);
    const [skipped, setSkipped] = React.useState(new Set());
    const steps = getSteps();

    const isStepOptional = (step) => {
        return step === 1;
    };

    const isStepFailed = (step) => {
        return step === 1;
    };

    const isStepSkipped = (step) => {
        return skipped.has(step);
    };

    const handleNext = () => {
        let newSkipped = skipped;
        if (isStepSkipped(activeStep)) {
            newSkipped = new Set(skipped.values());
            newSkipped.delete(activeStep);
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped(newSkipped);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleSkip = () => {
        if (!isStepOptional(activeStep)) {
            // You probably want to guard against something like this,
            // it should never occur unless someone's actively trying to break something.
            throw new Error("You can't skip a step that isn't optional.");
        }

        setSkipped((prevSkipped) => {
            const newSkipped = new Set(prevSkipped.values());
            newSkipped.add(activeStep);
            return newSkipped;
        });
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };
    return (
        <Dialog
            // disableBackdropClick
            // disableEscapeKeyDown
            fullWidth
            maxWidth="md"
            aria-labelledby="confirmation-dialog-title"
            open={open}
            onClose={handleCancel}
        >
            <DialogTitle id="confirmation-dialog-title">Wrist Index</DialogTitle>
            <DialogContent dividers>
                <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                <div>
                    {activeStep === steps.length ? (
                        <div>
                            <Typography className={classes.instructions}>All steps completed</Typography>
                            <Button onClick={handleReset}>Reset</Button>
                        </div>
                    ) : (
                        <div>
                            <Typography className={classes.instructions}>{getStepContent(activeStep,props)}</Typography>
                            <div>
                                <Button
                                    disabled={activeStep === 0}
                                    onClick={handleBack}
                                    className={classes.backButton}
                                >
                                    Back
                                </Button>
                                <Button variant="contained" color="primary" onClick={handleNext}>
                                    {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancel} color="text.secondary">
                    Cancel
                </Button>
                <Button onClick={handleSubmit} color="primary">
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default WristIndex;
