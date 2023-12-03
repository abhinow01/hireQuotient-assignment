import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Checkbox,
  Button,
  TextField,
  Box,
} from '@mui/material';

function App() {
  const [users,setUsers] = useState([]);
  const [filteredUsers,setFilteredUsers] = useState([]);
  const [selectedRows,setSelectedRows] = useState([]);
  const [searchTerms, setSearchTerms] = useState('');
  const [currentPage,setCurrentPage] = useState(1);
  const usersPerPage = 10;

  useEffect(()=>{
    axios.get('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json').then(response=>{
      setUsers(response.data);
      setFilteredUsers(response.data);
    }).catch(error=>{
      console.log("Error fetching data:",error)
    })
  },[])

  useEffect(()=>{
 const filtered = users.filter(user => 
  user.name.toLowerCase().includes(searchTerms.toLowerCase() ) ||
  user.email.toLowerCase().includes(searchTerms.toLowerCase()) || 
  user.role.toLowerCase().includes(searchTerms.toLowerCase())
  );
  setFilteredUsers(filtered);
  setCurrentPage(1);
},[searchTerms,users]);

const indexOfLastUser = currentPage*usersPerPage;
const indexOfFirstUser = indexOfLastUser - usersPerPage ;
const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

const paginate = (pageNumber) =>{
setCurrentPage(pageNumber);
}

const toggleRowSelection = (id)=>{
const selectedIndex = selectedRows.indexOf(id);
let newSelectedRows = [...selectedRows];
if (selectedIndex === -1){
 newSelectedRows.push(id);
}else{
  newSelectedRows.splice(selectedIndex, 1);
}
setSelectedRows(newSelectedRows);
};

const deleteSelectedRows = ()=>{
  const updatedUsers = users.filter(user =>!selectedRows.includes(user.id));
    setUsers(updatedUsers);
    setFilteredUsers(updatedUsers);
    setSelectedRows([]);
}

const deleteAllRows = () =>{
  setUsers([])
  setSelectedRows([]);
  setFilteredUsers([]);
};

  return (
    <>
      <Box p={3}>
      <Button variant="contained" onClick={deleteAllRows} style={{ position: 'absolute', top: 10, right: 10 }}>
        Delete All
      </Button>
      <TextField
        label="Search"
        variant="outlined"
        value={searchTerms}
        onChange={(e) => setSearchTerms(e.target.value)}
        sx={{ mb: 3 }}
      />
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Action</TableCell>
            <TableCell>
              <Button
                variant="contained"
                onClick={() => deleteSelectedRows()}
                disabled={selectedRows.length === 0}
              >
                Delete Selected
              </Button>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currentUsers.map(user =>(
            <TableRow key={user.id} style={{background: selectedRows.includes(user.id) ? '#ccc' : 'transparent'}}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
              <Button variant="outlined" className="edit" style={{margin: 10}}>Edit</Button>
              <Button variant="outlined" className="delete" onClick={() => console.log(`Delete user with ID: ${user.id}`)}>
                  Delete
                </Button>
              </TableCell>
              <TableCell>
                <Checkbox
                  onChange={() => toggleRowSelection(user.id)}
                  checked={selectedRows.includes(user.id)}
                />
                </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Box mt={3}>
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <div style={{ marginRight: '10px' }}>Page {currentPage}</div>
    <Button onClick={() => paginate(1)}>First</Button>
    <Button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
      Previous
    </Button>
    <Button onClick={() => paginate(currentPage + 1)} disabled={indexOfLastUser >= filteredUsers.length}>
      Next
    </Button>
    <Button onClick={() => paginate(Math.ceil(filteredUsers.length / usersPerPage))}>Last</Button>
  </div>
</Box>
</Box>
    </>
  )
}

export default App;
