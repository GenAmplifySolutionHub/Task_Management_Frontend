import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    CssBaseline,
    IconButton,
    Paper,
    styled,
    Table,
    TableBody,
    TableCell,
    tableCellClasses,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Toolbar,
    Tooltip,
    Typography,
} from '@mui/material';
import { StyledToolbar } from '../SuperAdmin/styles';
import { getTasksByAssignedEmployeeCompleted } from '../../apiRequest/EmployeTaskApi/EmployeTaskRoute';
import EditTaskForm from '../../components/EmployTask/EditTaskForm';
import DataRenderLayoutAgent from '../../layouts/dataRenderLayoutAgent';
import EditNoteIcon from '@mui/icons-material/EditNote';
import { updateTask } from '../../apiRequest/TaskRoutes/TaskRoutes';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#f26729',
        color: 'white',
        padding: '1em 8px', // Adjust the padding as needed
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 12, // Reduce the font size
        padding: 'px 8px', // Adjust the padding as needed
    },
}));
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));
  




function EmployTaskTable() {
    const [tasks, setTasks] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [openEdit, setOpenEdit] = useState(false); // State to open/close Edit Task dialog
    const [selectedTask, setSelectedTask] = useState<any>(null); // Store selected task for editing
    const [page, setPage] = useState(1); // Current page
    const [limit, setLimit] = useState(5); // Items per page
    const [search, setSearch] = useState(''); // Search term
    const [totalTasks, setTotalTasks] = useState(0); // Total tasks for pagination

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const data = await getTasksByAssignedEmployeeCompleted( page, limit, search);
                console.log('API Response:', data); 
                    setTasks(data.tasks);
                    setTotalTasks(data.total);                     
            } catch (err) {
                setError('Failed to fetch tasks.');
                console.error('Fetch error:', err); // Log the error for debugging
            }
        };
        fetchTasks();
    }, [page, limit, search]);

    const handleClickOpenEdit = (task: any) => {
        setSelectedTask(task);
        setOpenEdit(true);
    };

    const handleCloseEdit = () => {
        setOpenEdit(false);
        setSelectedTask(null); // Reset the selected task
    };

  
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
        setPage(1);
    };
    const normalizeDate = (date: any) => {
        return date ? new Date(date).toISOString().split('T')[0] : '';
    };
    
    return (
        <DataRenderLayoutAgent>
            <Box sx={{ width: '100%', paddingLeft: 2, paddingRight: 2, marginTop: 1, overflow: 'auto' }}>
                <CssBaseline />
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <StyledToolbar>
                        <Typography variant="h6" component="div" sx={{ flex: '1 1 1', color: 'black', marginLeft: '1em' }}>
                            Task List
                        </Typography>
                        <TextField
                        variant="outlined"
                        placeholder="Search tasks..."
                        value={search}
                        size='small'
                        onChange={handleSearchChange}
                        sx={{zIndex: 200 }}
                    />
                    </StyledToolbar>
                    
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                   
                </Box>
                <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', marginTop: '-4em', width: '100%' }}>
                    <Toolbar />
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 700 }} aria-label="customized table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>S.No</StyledTableCell>
                                    <StyledTableCell align="center">Task</StyledTableCell>
                                    <StyledTableCell align="center">Start Time</StyledTableCell>
                                    <StyledTableCell align="center">End Date</StyledTableCell>
                                    <StyledTableCell align="center">End Time</StyledTableCell>
                                    <StyledTableCell align="center">Task Status</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {tasks.length > 0 ? (
                                    tasks.map((task, index) => (
                                        <StyledTableRow key={task.Task_details_Id}>
                                            <StyledTableCell component="th" scope="row">
                                                {index + 1 + (page - 1) * limit} {/* Adjust serial number for pagination */}
                                            </StyledTableCell>
                                            <StyledTableCell align="center">{task?.Task_Details}</StyledTableCell>
                                            <StyledTableCell align="center">{task?.Start_Time}</StyledTableCell>
                                            <StyledTableCell align="center">{normalizeDate(task?.End_Date)}</StyledTableCell>
                                            <StyledTableCell style={{ textAlign: "center" }}>
                                                {task?.End_Time}
                                            </StyledTableCell>
                                            <StyledTableCell align="center">{task?.Status}</StyledTableCell>
                                        </StyledTableRow>
                                    ))
                                ) : (
                                    <StyledTableRow>
                                        <StyledTableCell colSpan={6} align="center">
                                            <Typography variant="body1">No tasks found.</Typography>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
                        <Typography variant="body2" component="div">
                            <Button disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</Button>
                            Page {page} of {Math.ceil(totalTasks / limit)} | Total Tasks: {totalTasks}
                            <Button disabled={tasks.length < limit} onClick={() => setPage(page + 1)}>Next</Button>
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </DataRenderLayoutAgent>
    );
}

export default EmployTaskTable;
