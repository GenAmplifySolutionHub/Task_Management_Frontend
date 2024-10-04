import React, { useState, useEffect, useContext } from 'react';
import {
  Table, TableBody, TableContainer, TableHead, TableRow,
  TablePagination, TableSortLabel, Paper, Typography, IconButton, Icon, InputAdornment,
  Grid, Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, AppBar, Divider,
  TableCell,
  Tooltip
} from '@mui/material';
import { StyledTableCell, StyledTableRow, SearchField, StyledToolbar, AddUserButton } from './styles';
import AddUserDialog from './AddAgentDialog';
import EditAgentDialog from './EditAgentDialog';
import { MdEdit, MdDelete, MdPeople } from "react-icons/md";
import SearchIcon from '@mui/icons-material/Search';
import Navbar from './Navbar';
import { Link, useLocation } from 'react-router-dom';
import { agentsFetch, agentUpdate, agentDelete } from '../../apiRequest/agent/agents';
import ConfirmDelete from '../user/Newforms1/ConfirmDelete';
import '../admin/shimmer.css'
import AdminContext from '../../utils/adminContext';
import DataRenderLayoutAdmin from '../../layouts/dataRenderLayoutAdmin';

interface User {
  id: number;
  user_name: string;
  first_name: string;
  last_name: string;
  full_name: string;
  ph_no: string;
  phone_ext: string;
  e_mail: string;
  active:boolean;
}

const drawerWidth = 240;

const AgentTable = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<keyof User>('user_name');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editUserInitialValues, setEditUserInitialValues] = useState<User | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState<{ open: boolean; id: number | null }>({
    open: false,
    id: null
  })
  const { setOpenNotifier, setNotifyMessage, setHiderDurationNotifier } = useContext(AdminContext);
  const [loading, setLoading] = useState(true);
  const fetchAgents = async (page: number, limit: number, search: string) => {   
    setLoading(true);
    try {
      const response = await agentsFetch(page + 1, limit, search); //update
      console.log('The response is here:', response);
      const fetchedUsers = response?.agents?.map((agent: any) => ({
        ...agent,
        full_name: `${agent.first_name} ${agent.last_name}`,
      }));
      setUsers(fetchedUsers);
      setTotalItems(response?.pagination?.totalItems || 0);
    } catch (error) {
      console.error('Error fetching data: ', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAgents(page, rowsPerPage,searchQuery);  //updated
  }, [page, rowsPerPage,searchQuery]);

  const handleRequestSort = (property: keyof User) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleChangePage = (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredUsers = users?.filter((user) =>
    user?.user_name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    user?.full_name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    user.e_mail?.toLowerCase()?.includes(searchQuery?.toLowerCase())
  );

  const sortedUsers = filteredUsers?.sort((a, b) => {
    if (a[orderBy] < b[orderBy]) return order === 'asc' ? -1 : 1;
    if (a[orderBy] > b[orderBy]) return order === 'asc' ? 1 : -1;
    return 0;
  });

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };
  const handleCloseConfirmationDialog = () => {
    setOpenConfirmationDialog({ open: false, id: null });
  };
  const handleCloseDialog = (shouldFetch = false) => {
    setOpenDialog(false);
    if (shouldFetch) {
      fetchAgents(page, rowsPerPage,searchQuery);   //updated
    }
  };
  const handleOpenConfirmationDialog = (id: number) => {
    setOpenConfirmationDialog({ open: true, id });
  };
  const handleEditUser = (user: User) => {
    setEditDialogOpen(true);
    setEditUserInitialValues(user);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setEditUserInitialValues(null);
  };

  const handleEditSubmit = async (values: any, { setFieldError }: any) => {
    if (editUserInitialValues) {
      try {
        console.log("edit id:",editUserInitialValues.id)
        console.log("values:",values)
        const response = await agentUpdate(editUserInitialValues.id, values);

        if (response.message.includes("Agent Updated Sucessfully")) {
          console.log("succsess")
          handleCloseEditDialog();
          fetchAgents(page, rowsPerPage, searchQuery);  //updated
         
          setOpenNotifier(true);
          setNotifyMessage('Agent updated successfully');
          setHiderDurationNotifier(3000);
        }

      } catch (error) {
        console.log('Error updating Agent:', error);
        if (Array.isArray(error)) {
          error.forEach((err: { field: string, message: string }) => {
            setFieldError(err.field, err.message);
          });
        } else {
          // Handle other error messages (generic errors)
          if (error.message) {
            console.log('Server error:', error.message);
          }
        }
      }
    }
  };

  // const handleDeleteUser = async (id: number) => {
  //   const confirmed = window.confirm('Are you sure you want to delete this agent?');
  //   if (confirmed) {
  //     try {
  //       await agentDelete(id);
  //       fetchAgents(page, rowsPerPage);
  //       alert('Agent deleted successfully!');
  //     } catch (error) {
  //       console.error('Error deleting agent:', error);
  //       alert('Failed to delete the agent. Please try again.');
  //     }
  //   }
  // };
  const handleConfirmDelete = async () => {
    if (openConfirmationDialog.id !== null) {
      try {
        const response = await agentDelete(openConfirmationDialog.id);
        if (response.message.includes('User soft deleted successfully')) {
          fetchAgents(page, rowsPerPage, searchQuery); //update

          setOpenNotifier(true);
          setNotifyMessage('Agent Deleted Successfully');
          setHiderDurationNotifier(3000);
        }

      } catch (error) {
        console.error('Error deleting DEA record:', error);
      }
      handleCloseConfirmationDialog();
    }
  };

  const location = useLocation();

  // Determine if the current path matches the one for "Admin Table" or "Agent Table"
  const isAdminTableActive = location.pathname === '/super-admin-dashboard/admin-table';
  const isAgentTableActive = location.pathname === '/super-admin-dashboard/agents-table';
  const ShimmerTable = () => (
    <TableContainer sx={{ width: '100%', marginTop: '20px' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="left"><div className="shimmer shimmer-cell"></div></TableCell>
            <TableCell align="left"><div className="shimmer shimmer-cell"></div></TableCell>
            <TableCell align="left"><div className="shimmer shimmer-cell"></div></TableCell>
            <TableCell align="right"><div className="shimmer shimmer-cell"></div></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.from({ length: 5 }).map((_, index) => (
            <TableRow key={index}>
              <TableCell align="left"><div className="shimmer shimmer-cell"></div></TableCell>
              <TableCell align="left"><div className="shimmer shimmer-cell"></div></TableCell>
              <TableCell align="left"><div className="shimmer shimmer-cell"></div></TableCell>
              <TableCell align="right"><div className="shimmer shimmer-cell"></div></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <DataRenderLayoutAdmin>
    <Box sx={{ display: 'flex', paddingLeft: 2, paddingRight: 2, width: 'auto', marginTop: -6, overflow: 'auto' }}>
      {/*
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Navbar />
      </AppBar>
      */}
      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', width: '100%', marginTop: 0 }}>
        <Toolbar />
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <StyledToolbar>
              {/* <Typography variant="h6" component="div" sx={{ flex: '1 1 1', color: 'blue' }}>
                Agent
              </Typography> */}
              <AddUserButton variant="contained" color="primary" onClick={handleOpenDialog} style={{marginLeft:'0.2em'}}>
                Add New Agent
              </AddUserButton>
              <SearchField
                style={{marginRight:'-0.9px'}}
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search Name , Username , Email"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  sx: { height: '30px', padding: '0 10px' }
                }}
                sx={{ width: '30%' }}
              />
            </StyledToolbar>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                  <StyledTableCell>
                      S. No.
                  </StyledTableCell>
                  <StyledTableCell>
                    <TableSortLabel
                      active={orderBy === 'full_name'}
                      direction={orderBy === 'full_name' ? order : 'asc'}
                      onClick={() => handleRequestSort('full_name')}
                    >Name
                    </TableSortLabel>
                  </StyledTableCell>
                    <StyledTableCell>
                      <TableSortLabel
                        active={orderBy === 'user_name'}
                        direction={orderBy === 'user_name' ? order : 'asc'}
                        onClick={() => handleRequestSort('user_name')}
                      >
                        Username
                      </TableSortLabel>
                    </StyledTableCell>

                    <StyledTableCell>
                      <TableSortLabel
                        active={orderBy === 'ph_no'}
                        direction={orderBy === 'ph_no' ? order : 'asc'}
                        onClick={() => handleRequestSort('ph_no')}
                      >
                        Phone Number
                      </TableSortLabel>
                    </StyledTableCell>
                    <StyledTableCell>
                      <TableSortLabel
                        active={orderBy === 'e_mail'}
                        direction={orderBy === 'e_mail' ? order : 'asc'}
                        onClick={() => handleRequestSort('e_mail')}
                      >
                        Email
                      </TableSortLabel>
                    </StyledTableCell>
                    <StyledTableCell>
                          <TableSortLabel
                          active={orderBy === 'active'}
                         direction={orderBy === 'active' ? order : 'asc'}
                         onClick={() => handleRequestSort('active')}
                           >
                           Status
                        </TableSortLabel>
                      </StyledTableCell>
                    <StyledTableCell style={{textAlign:'center'}}>
                      Actions
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                {!loading && users?.length === 0 ? (
                  <TableBody>
                    <StyledTableRow>
                      <StyledTableCell colSpan={5}>
                        <Typography variant="h6" align="center">
                          No data available
                        </Typography>
                      </StyledTableCell>
                    </StyledTableRow>
                  </TableBody>
                ) : (
                  <TableBody>
                    {sortedUsers?.map((user, index) => (
                      <StyledTableRow key={user.id}>
                        <StyledTableCell>{page * rowsPerPage + index + 1}</StyledTableCell>
                        <StyledTableCell>{user.full_name}</StyledTableCell>
                        <StyledTableCell>{user.user_name}</StyledTableCell>
                        <StyledTableCell>{user.ph_no}</StyledTableCell>
                        <StyledTableCell>{user.e_mail}</StyledTableCell>
                        <StyledTableCell>
                                            {user.active ? 'Active' : 'Inactive'}
                                        </StyledTableCell>
                        <StyledTableCell style={{textAlign:'center'}}>
                          <Tooltip title="Edit" placement='top'>
                            <IconButton onClick={() => handleEditUser(user)}>
                              <Icon sx={{ color: 'blue' }}><MdEdit /></Icon>
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete" placement='top'>
                            <IconButton onClick={() => handleOpenConfirmationDialog(user.id)}>
                              <Icon sx={{ color: 'red' }}><MdDelete /></Icon>
                            </IconButton>
                          </Tooltip>
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                )}
              </Table>
              {loading && <ShimmerTable />}
            </TableContainer>
            <TablePagination
                        style={{marginRight:'-1em'}}
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={totalItems}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
            <AddUserDialog
              fetchAgents={fetchAgents}
              open={openDialog}
              onClose={handleCloseDialog}
              page={page}
              rowsPerPage={rowsPerPage}
            />
            <ConfirmDelete
              open={openConfirmationDialog.open}
              title="Confirm Delete"
              content="Are you sure you want to delete this record?"
              onClose={handleCloseConfirmationDialog}
              onConfirm={handleConfirmDelete}
            />
            {editUserInitialValues && (
              <EditAgentDialog
                open={editDialogOpen}
                
                onClose={handleCloseEditDialog}
                initialValues={editUserInitialValues}
                onSubmit={handleEditSubmit}
              />
            )}
          </Grid>
        </Grid>
      </Box>
    </Box>
    </DataRenderLayoutAdmin>
  );
};

export default AgentTable;