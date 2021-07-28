import React, {useEffect} from 'react';
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import TextField from "@material-ui/core/TextField";

function Comment(props) {
    const {handleSubmit,handleCancel,open} = props;

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
            <DialogTitle id="confirmation-dialog-title">Comment</DialogTitle>
            <DialogContent dividers>
                <TextField
                    disabled={props.viewMode}
                    multiline
                    fullWidth
                    defaultValue={(props.getOutputData('comment')??{text:''}).text}
                    onChange={event=>props.getOutputData({"comment":{...(props.getOutputData('comment')??{}),text:event.target.value,updated:new Date()}})} variant="outlined"
                />
            </DialogContent>
            {props.viewMode?'':<DialogActions>
                <Button onClick={handleCancel} color="text.secondary" style={{float:'left'}}>
                    Cancel
                </Button>
                <Button variant="contained" color="primary" onClick={handleSubmit}>Save</Button>
            </DialogActions>}
        </Dialog>)
}

export default Comment;
