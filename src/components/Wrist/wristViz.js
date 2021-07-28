import React, {useEffect, useRef} from "react";

import Grid from "@material-ui/core/Grid";
import RadarChart from "./radarChart";

function WristViz(props) {
    const firstUpdate = useRef(true);
    useEffect(() => {
        if (props.onLoad&&firstUpdate.current) {
            firstUpdate.current = false;
            props.onLoad(false);
            return;
        }
    });
    return (
        <>
            <Grid container alignItems="center" justify="space-between">
                <Grid item xs>
                    <RadarChart keyColor={"_id"} colors={props.colors} data={props.data} selectedIndex={props.selectedIndex}/>
                </Grid>
            </Grid>
        </>
    );
}

export default WristViz;
