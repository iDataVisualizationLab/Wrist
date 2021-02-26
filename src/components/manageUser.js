import React, {useEffect, useRef} from "react";
import {
    InputBase,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow
} from "@material-ui/core";
import {fade, makeStyles} from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import Grid from "@material-ui/core/Grid";
import AddIcon from "@material-ui/icons/Add";
import Button from "@material-ui/core/Button";
import * as axios from "axios";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import VisibilityIcon from '@material-ui/icons/Visibility';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    container: {
        maxHeight: 440,
    },
    searchHolder:{
        margin: theme.spacing(1),
        marginLeft : 0,
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(1),
            width: 'auto',
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    }
}));
const columns = [{
    id: 'Initials',
    label: 'Initials',
    align: 'center',
},{
    id: 'Date of Birth',
    label: 'Date of Birth',
    align: 'center',
},{
    id: 'Gender',
    label: 'Gender',
    align: 'center',
}];
function ManageUser(props) {
    const classes = useStyles();
    const {rows} = props;
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    // const [rows, setRows] = React.useState([]);
    const firstUpdate = useRef(true);
    useEffect(() => {
        if (firstUpdate.current) {
            firstUpdate.current = false;
            // axios.get(`${((process.env.NODE_ENV === 'production')?process.env.REACT_APP_API_URL:process.env.REACT_APP_API_URL_LOCAL)}/patientProfile/list`)
            //     .then(r=>{
            //         setRows(r.data)
            //     });
            props.onLoad(false);
            return;
        }
    });
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    return (
        <>
            <Grid container alignItems="center" justify="space-between" style={{marginTop:20}}>
                <Grid item xs>
                {/*<Paper className={classes.searchHolder}>*/}
                {/*    <div className={classes.search}>*/}
                {/*        <div className={classes.searchIcon}>*/}
                {/*            <SearchIcon/>*/}
                {/*        </div>*/}
                {/*        <InputBase*/}
                {/*            placeholder="Search…"*/}
                {/*            classes={{*/}
                {/*                root: classes.inputRoot,*/}
                {/*                input: classes.inputInput,*/}
                {/*            }}*/}
                {/*            inputProps={{'aria-label': 'search'}}*/}
                {/*        />*/}
                {/*    </div>*/}
                {/*</Paper>*/}
                </Grid>
                <Grid item>
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        className={classes.AddButton}
                        startIcon={<AddIcon />}
                        onClick={props.newPatient}
                    >
                        Add new patient
                    </Button>
                </Grid>
            </Grid>
            <Paper className={classes.root}>
                <TableContainer className={classes.container}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{minWidth: column.minWidth}}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                                        {columns.map((column) => {
                                            const value = row[column.id];
                                            return (
                                                <TableCell key={column.id} align={column.align}>
                                                    {column.format && typeof value === 'number' ? column.format(value) : value}
                                                </TableCell>
                                            );
                                        })}
                                        <TableCell key='btnCell' align="middle">
                                            <IconButton aria-label="view"  size="small" onClick={()=>props.viewPatient(row)}>
                                                <VisibilityIcon fontSize="inherit"/>
                                            </IconButton>
                                            <IconButton  aria-label="edit" size="small" onClick={()=>props.editPatient(row)}>
                                                <EditIcon fontSize="inherit"/>
                                            </IconButton>
                                            <IconButton color="secondary" aria-label="delete"  size="small" onClick={()=>props.deletePatient(row)}>
                                                <DeleteIcon fontSize="inherit"/>
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />
            </Paper>
        </>
    );
}

export default ManageUser;
