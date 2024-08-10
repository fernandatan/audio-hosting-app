import { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, CssBaseline, Box, Typography, Button, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import HamburgerMenu from '../shared/hamburgerMenu';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import UserDialog from './userDialog';

interface User {
    _id: string;
    username: string;
}

const UserManagement = () => {
  const [userList, setUserList] = useState<User[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState<User>();

  const menuLinks = [
    { id: 'upload', text: 'Upload New Audio', href: '../upload' },
    { id: 'display', text: 'Audio Library', href: '../display' },
  ];

  const fetchUsers = async () => {
    axios.get("http://localhost:5000/api/user/get")
    .then((response) => {
        setUserList(response.data);
    }).catch((error) => {
        console.log(`We have a server error`, error);
    });
}

  useEffect(() => {
    fetchUsers();
  }, [])

  const handleCreateUser = () => {
    setOpenDialog(true);
  };

  const handleEditUser = (user: User) => {
    setCurrentUser(user);
    setOpenDialog(true);
  };

  const handleSaveUser = async (userData: any) => {
    try {
      if (currentUser) {
        await axios.put(`http://localhost:5000/api/user/put/${currentUser._id}`, userData);
      } else {
        await axios.post('http://localhost:5000/api/user/post', userData);
      }
      fetchUsers();
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/user/delete/${id}`);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div id="outer-container">
      <HamburgerMenu links={menuLinks} />

      <div id="page-wrap">
        <Container maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              mt: 10,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography variant="h5">User Management</Typography>
            <TableContainer component={Paper} sx={{mt: 5}}>
            <Table>
                <TableHead>
                <TableRow>
                    <TableCell>Username</TableCell>
                    <TableCell align="right">Actions</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {userList.map((user) => (
                    <TableRow key={user._id}>
                    <TableCell>{user.username}</TableCell>
                    <TableCell align="right">
                        <IconButton
                            color="primary"
                            onClick={() => handleEditUser(user)}
                        >
                        <EditIcon />
                        </IconButton>
                        <IconButton
                            color="secondary"
                            onClick={() => deleteUser(user._id)}
                        >
                        <DeleteIcon />
                        </IconButton>
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            <Button
                variant="contained"
                color="primary"
                onClick={() => handleCreateUser()}
                sx={{ my: 2 }}
            >
                Add New User
            </Button>
            </TableContainer>
            <UserDialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                onSave={handleSaveUser}
                user={currentUser}
            />
          </Box>
        </Container>
      </div>
    </div>
  );
}

export default UserManagement;
