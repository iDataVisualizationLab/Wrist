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
    TableRow,
    Typography
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
import ShareIcon from '@material-ui/icons/Share';
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";
import TextField from "@material-ui/core/TextField";
import Moment from "moment";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Autocomplete from "@material-ui/lab/Autocomplete";
import WristChart from "./Wrist/WristChart";
import InfoIcon from '@material-ui/icons/Info';
import Tooltip from "@material-ui/core/Tooltip";

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    container: {
        // maxHeight: 440,
    },
    searchHolder: {
        margin: theme.spacing(1),
        marginLeft: 0,
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
    },
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    },
    cell: {
        overflow: 'hidden',
        textOverflow: "ellipsis"
    }
}));
const columns = [{
    id: 'Initials',
    label: 'Initials',
    align: 'center',
}, {
    id: 'Date of Birth',
    label: 'Date of Birth',
    align: 'center',
    format: (d) => d&&Moment.utc(d).format('DD/MM/yyyy'),
    minWidth: 150
}, {
    id: 'Gender',
    label: 'Gender',
    align: 'center',
}, {
    id: 'Date of Injury',
    label: 'Date of Injury',
    align: 'center',
    minWidth: 150,
    format: (d) => d&&Moment.utc(d).format('DD/MM/yyyy'),
}, {
    id: 'Hand dominance',
    label: 'Hand dominance',
    align: 'center'
}, {
    id: 'Involved Side',
    label: 'Involved Side',
    align: 'center'
}, {
    id: 'Contralateral Side',
    label: 'Contralateral Side',
    align: 'center'
}, {
    id: 'Profession',
    label: 'Profession',
    align: 'left',
    minWidth: 200,
    maxWidth: 200
}, {
    id: 'Evaluators Initials',
    label: 'Evaluators Initials',
    align: 'center'
}, {
    id: 'Evaluators Profession',
    label: 'Evaluators Profession',
    align: 'center'
}, {
    id: 'created',
    label: 'Create date',
    align: 'center',
    format: (d) => d&&Moment.utc(d).format('DD/MM/yyyy'),
    minWidth: 150
}, {
    id: 'Diagnosis',
    label: 'Diagnosis',
    align: 'left',
    minWidth: 200,
    maxWidth: 300
}];

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}
const useStylesBootstrap = makeStyles((theme) => ({
    arrow: {
        color: theme.palette.common.black,
    },
    tooltip: {
        backgroundColor: theme.palette.common.black,
    },
}));

function BootstrapTooltip(props) {
    const classes = useStylesBootstrap();

    return <Tooltip arrow classes={classes} {...props} />;
}
function ManageUser(props) {
    const classes = useStyles();
    const {rows} = props;
    const [page, setPage] = React.useState(0);
    const [shareWith, setshareWith] = React.useState([]);
    const [Shareable, setShareable] = React.useState(false);
    const [sharePatient, setSharePatient] = React.useState(undefined);
    const [copySuccess, setcopySuccess] = React.useState('');
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    // const [rows, setRows] = React.useState([]);
    const firstUpdate = useRef(true);
    const shareURL = useRef(null);
    useEffect(() => {
        if (firstUpdate.current) {
            firstUpdate.current = false;
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
    const copyToClipboard = (e) => {
        shareURL.current.select();
        document.execCommand('copy');
        e.target.focus();
        setcopySuccess('Copied!');
    };
    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };
    const createSortHandler = (property) => (event) => {
        handleRequestSort(event, property);
    };
    return (
        <>
            <Grid container alignItems="center" justify="space-between" style={{marginTop: 20}}>
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
                        startIcon={<AddIcon/>}
                        onClick={props.newPatient}
                    >
                        Add new patient
                    </Button>
                </Grid>
            </Grid>
            <Paper className={classes.root}>
                <TableContainer className={classes.container} >
                    <Table stickyHeader aria-label="sticky table" size={"small"}>
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={'center'}
                                        style={{minWidth: column.minWidth,maxWidth: column.maxWidth}}
                                        sortDirection={orderBy === column.id ? order : false}
                                    >
                                        <TableSortLabel
                                            active={orderBy === column.id}
                                            direction={orderBy === column.id ? order : 'asc'}
                                            onClick={createSortHandler(column.id)}
                                        >
                                            {column.label}
                                            {orderBy === column.id ? (
                                                <span className={classes.visuallyHidden}>
                                              {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                            </span>
                                            ) : null}
                                        </TableSortLabel></TableCell>
                                ))}
                                <TableCell align="center" style={{ minWidth: 200 }}>WristIndex</TableCell>
                                <TableCell style={{ minWidth: 150 }}/>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {stableSort(rows, getComparator(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                    return (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={row.code} style={row.shareBy&&{backgroundColor:'#90a3dd'}}>
                                            {columns.map((column) => {
                                                const value = row[column.id];
                                                return (
                                                    <TableCell key={column.id} align={column.align}
                                                               style={{minWidth: column.minWidth,width: column.maxWidth,maxWidth: column.maxWidth}}>
                                                        <div style={{ overflow: 'hidden', textOverflow: "ellipsis"}}>
                                                        <Typography noWrap variant={'inherit'}>
                                                        {column.format ? column.format(value) : value}
                                                        </Typography>
                                                        </div>
                                                    </TableCell>
                                                );
                                            })}
                                            <TableCell align="middle" style={{ minWidth: 200 }}>
                                                <WristChart data={row.WristIndex}/>
                                            </TableCell>
                                            <TableCell key='btnCell' align="middle" style={{ minWidth: 150 }}>
                                                {!row.shareBy&&<IconButton aria-label="share" size="small"
                                                            onClick={() => {
                                                                setSharePatient(row);
                                                                setshareWith(row.shareWith ?? [])
                                                            }}>
                                                    <ShareIcon fontSize="inherit"/>
                                                </IconButton>}
                                                {row.shareBy&&<BootstrapTooltip title={`Shared by ${row.shareBy.firstName} ${row.shareBy.lastName} <${row.shareBy.email}>`}>
                                                    <IconButton aria-label="share" size="small">
                                                    <InfoIcon fontSize="inherit"/></IconButton></BootstrapTooltip>}
                                                <IconButton aria-label="view" size="small"
                                                            onClick={() => props.viewPatient(row)}>
                                                    <VisibilityIcon fontSize="inherit"/>
                                                </IconButton>
                                                {!row.shareBy&&<><IconButton aria-label="edit" size="small"
                                                            onClick={() => props.editPatient(row)}>
                                                    <EditIcon fontSize="inherit"/>
                                                </IconButton>
                                                <IconButton color="secondary" aria-label="delete" size="small"
                                                            onClick={() => props.deletePatient(row)}>
                                                    <DeleteIcon fontSize="inherit"/>
                                                </IconButton></>}
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
            <Dialog
                open={sharePatient}
                onClose={() => {
                    setSharePatient(undefined);
                    setcopySuccess('')
                }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth
                maxWidth={"sm"}
            >
                <DialogTitle id="alert-dialog-title">Share Patient's Profile</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Autocomplete
                                    fullWidth
                                    multiple
                                    freeSolo
                                    // limitTags={2}
                                    value={shareWith}
                                    id="multiple-limit-tags"
                                    size={"small"}
                                    options={[]}
                                    // getOptionLabel={(option) => option.title}
                                    // defaultValue={[top100Films[13], top100Films[12], top100Films[11]]}
                                    onChange={(event, newValue) => {
                                        const inputs = newValue.filter(d => d.includes('@'));
                                        if(inputs!==shareWith) {
                                            setshareWith(inputs);
                                            setShareable(true);
                                        }
                                    }}
                                    renderInput={(params) => (
                                        <TextField {...params} variant="outlined" label="To:email"
                                                   type="email"
                                                   placeholder="email@something.com"/>
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button variant="contained" color="primary"
                                        disabled={!Shareable}
                                        onClick={()=>{props.onShare(sharePatient,shareWith).then(()=>{sharePatient.shareWith=shareWith});setShareable(false);}}>Share</Button>
                            </Grid>
                            <Grid item xs={12} container spacing={1}>
                                <Grid item xs={document.queryCommandSupported('copy') ? 10 : 12}>
                                    <TextField
                                        fullWidth
                                        // style={{"display":"none"}}
                                        inputRef={shareURL}
                                        value={sharePatient ? `${window.location.origin.toString()}/Wrist/#/view/${sharePatient._id}` : ''}
                                    />
                                </Grid>
                                {
                                    /* Logical shortcut for only displaying the
                                       button if the copy command exists */
                                    document.queryCommandSupported('copy') &&
                                    <Grid item xs="2">
                                        <div>
                                            <Button variant="contained" onClick={copyToClipboard}
                                                    color="primary">{copySuccess ? copySuccess : "Copy"}</Button>
                                        </div>
                                    </Grid>
                                }
                            </Grid>
                        </Grid>
                    </DialogContentText>
                </DialogContent>
                {/*<DialogActions>*/}
                {/*    <Button onClick={handleCloseConfirm} color="primary">*/}
                {/*        Cancel*/}
                {/*    </Button>*/}
                {/*    <Button onClick={confirmFunc.func} color="primary" autoFocus>*/}
                {/*        OK*/}
                {/*    </Button>*/}
                {/*</DialogActions>*/}
            </Dialog>
        </>
    );
}

export default ManageUser;
