import React, { useState, useEffect } from 'react';
import {
    Table, TableBody, TableContainer, TableHead, TableRow,
    TablePagination, Paper, Typography, IconButton, Grid, TableCell, Box, Tooltip, CssBaseline, Toolbar, Button,
    styled, tableCellClasses,
    InputAdornment,
    Icon,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material';
import { MdEdit, MdDelete } from "react-icons/md";
import { useParams } from 'react-router-dom';
import { AddUserButton, SearchField, StyledToolbar } from '../SuperAdmin/styles';
import { getProjectEmployees, patchProjectEmployee } from '../../apiRequest/ProjectRoutes/ProjectRoutes';
import AddMemberDialog from './AddMemberDialog';
import DataRenderLayoutAdmin from '../../layouts/dataRenderLayoutAdmin';
import { useWarningDialog } from '../../middleware/dialogService';
import EditMemberDialog from './EditMemberDialog';
import { deleteProjectEmployee } from '../../apiRequest/ProjectEmployeDelete/ProjectEmployeeDelete';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#f26729',
        color: 'white',
        padding: '1em 8px', // Adjust the padding as needed
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 12, // Reduce the font size
        padding: '6px 8px', // Adjust the padding as needed
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

const ProjectMember: React.FC = () => {
    const { id } = useParams();
    const [employees, setEmployees] = useState<any[]>([]); const [openAddDialog, setOpenAddDialog] = useState(false);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(0);  // for pagination
    const [rowsPerPage, setRowsPerPage] = useState(5);  // for pagination
    const [searchQuery, setSearchQuery] = useState(''); // for search
    const [totalRows, setTotalRows] = useState(0);  // total rows for pagination
    const { showWarningDialog, DialogComponent } = useWarningDialog();
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [employeeToDelete, setEmployeeToDelete] = useState<any>(null);

    const handleOpenAddDialog = () => {
        setOpenAddDialog(true);
    };

    const handleCloseAddDialog = (shouldFetch = false) => {
        setOpenAddDialog(false);
        if (shouldFetch) {
            //   fetchGroups(page, rowsPerPage, searchQuery);  //update
        }
    };

    const fetchEmployees = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getProjectEmployees(Number(id), page + 1, rowsPerPage, searchQuery, showWarningDialog);
            setEmployees(data.data);
            setTotalRows(data.total);  // total rows
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, [id, page, rowsPerPage, searchQuery]);

    // Handling page change for pagination
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    // Handling rows per page change for pagination
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Reset to first page
    };

    // Handle search query input
    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
        setPage(0); // Reset to first page after search
    };

    const handleOpenEditDialog = (employee: any) => {
        setSelectedEmployee(employee);
        setOpenEditDialog(true);
    };

    const handleCloseEditDialog = (shouldFetch: boolean = false) => {
        setOpenEditDialog(false);
        setSelectedEmployee(null);
        if (shouldFetch) {
            fetchEmployees();
        }
    };

    const handleSaveEdit = async (updatedEmployee: any) => {
        try {
            await patchProjectEmployee(
                showWarningDialog,
                Number(id),
                updatedEmployee.ProjectMember_Id,
                {
                    Emp_Id: updatedEmployee.Emp_Id,
                    Role_Id: updatedEmployee.Role_Id,
                    Degesination: updatedEmployee.Degesination
                }
            );
            handleCloseEditDialog(true);
        } catch (error) {
            console.error('Failed to update employee:', error);
        }
    };


    const handleOpenDeleteDialog = (employee: any) => {
        setEmployeeToDelete(employee);
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setEmployeeToDelete(null);
        setOpenDeleteDialog(false);
    };

    const handleDeleteEmployee = async () => {
        if (employeeToDelete) {
            try {
                await deleteProjectEmployee(showWarningDialog,employeeToDelete.Project_Id,employeeToDelete.Emp_Id);
                handleCloseDeleteDialog();
                fetchEmployees();
            } catch (error) {
                console.error('Failed to delete employee:', error);
            }
        }
    };
    return (
        <DataRenderLayoutAdmin>

            <Box sx={{ width: 'auto', overflow: 'auto', paddingLeft: 2, paddingRight: 2 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} padding={2} sx={{ marginTop: '1.4em' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Grid>
                                <SearchField
                                    value={searchQuery}
                                    onChange={handleSearch}
                                    placeholder="Search by Employee Name"
                                    size='small'

                                />
                            </Grid>
                            <Grid>
                                <Button variant="contained" color="primary" onClick={handleOpenAddDialog}  >
                                    Add New Member
                                </Button>
                            </Grid>
                            <AddMemberDialog
                                open={openAddDialog}
                                onClose={(shouldFetch) => handleCloseAddDialog(shouldFetch)}
                                fetchEmployees={fetchEmployees} // Pass the actual function
                            />
                        </Box>
                    </Grid>
                </Grid>

                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 700 }} aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>S.No</StyledTableCell>
                                <StyledTableCell align="center">Emp Id</StyledTableCell>
                                <StyledTableCell align="center">Project Name</StyledTableCell>
                                <StyledTableCell align="center">Employee Name</StyledTableCell>
                                <StyledTableCell align="center">Role</StyledTableCell>
                                <StyledTableCell align="center">Designation</StyledTableCell>
                                <StyledTableCell align="center">Actions</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {employees?.map((employee, index) => (
                                <StyledTableRow key={employee.Emp_Id}>
                                    <StyledTableCell component="th" scope="row">
                                        {page * rowsPerPage + index + 1}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">{employee.Emp_Id}</StyledTableCell>
                                    <StyledTableCell align="center">{employee.Project_Name}</StyledTableCell>
                                    <StyledTableCell align="center">{employee.Employee_name}</StyledTableCell>
                                    <StyledTableCell align="center">{employee.Role_Name}</StyledTableCell>
                                    <StyledTableCell align="center">{employee.Degesination}</StyledTableCell>
                                    <StyledTableCell align="center">
                                        <Tooltip title="Edit" placement="top">
                                            <IconButton onClick={() => handleOpenEditDialog(employee)}>
                                                <MdEdit color='blue' />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete" placement="top">
                                        <IconButton onClick={() => handleOpenDeleteDialog(employee)}>
                                                <MdDelete color='red' />
                                            </IconButton>
                                        </Tooltip>
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <TablePagination
                    component="div"
                    count={totalRows}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
                {DialogComponent}
                <EditMemberDialog
                    open={openEditDialog}
                    onClose={handleCloseEditDialog}
                    employee={selectedEmployee}
                />

                <Dialog
                    open={openDeleteDialog}
                    onClose={handleCloseDeleteDialog}
                >
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete this employee?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDeleteDialog} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleDeleteEmployee} color="secondary" autoFocus>
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </DataRenderLayoutAdmin>

    );
};

export default ProjectMember;
