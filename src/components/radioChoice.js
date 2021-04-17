import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Rating from "@material-ui/lab/Rating";
import Box from "@material-ui/core/Box";
import React, {useEffect} from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles({
    root: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        minHeight: 30
    },
});

function RadioChoice(props){
    const [value, setValue] = React.useState(0);
    const [hover, setHover] = React.useState(-1);
    const classes = useStyles();
    useEffect(()=>{
        setValue(props.value);
    });
    return(<div className={classes.root}>
        <Rating
            name="hover-feedback"
            {...props}
            value={value}
            size={props.max>5?"small":"medium"}
            onChange={(event, newValue) => {
                if (props.handeData){
                    props.handeData(newValue);
                }else{
                    setValue(newValue);
                }
            }}
            onChangeActive={(event, newHover) => {
                setHover(newHover);
            }}
        />
        {value !== null && <Box ml={2}>{props.labels?props.labels[hover !== -1 ? hover : value]:(hover !== -1 ? hover : value)}</Box>}
    </div>)
}
export default RadioChoice;
