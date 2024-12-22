import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Checkbox,
  Paper,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, PlaylistAdd as PlaylistAddIcon } from '@mui/icons-material';
import axios from 'axios';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingTodo, setEditingTodo] = useState(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/todos`);
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/todos`, 
        { title: newTodo.trim() },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      setTodos([response.data, ...todos]);
      setNewTodo('');
    } catch (error) {
      console.error('Error creating todo:', error.response?.data || error.message);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit(e);
    }
  };

  const handleToggle = async (id, completed) => {
    try {
      await axios.patch(`${process.env.REACT_APP_API_URL}/todos/${id}`, {
        completed: !completed,
      });
      fetchTodos();
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/todos/${id}`);
      fetchTodos();
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const handleEdit = async (todo) => {
    if (editingTodo && editingTodo._id === todo._id) {
      try {
        await axios.patch(`${process.env.REACT_APP_API_URL}/todos/${todo._id}`, {
          title: editingTodo.title,
        });
        fetchTodos();
        setEditingTodo(null);
      } catch (error) {
        console.error('Error updating todo:', error);
      }
    } else {
      setEditingTodo(todo);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Todo List
        </Typography>
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Add new todo"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <Button variant="contained" type="submit">
                Add
              </Button>
            </Box>
          </form>
        </Paper>

        <Paper elevation={3}>
          {todos.length > 0 ? (
            <List>
              {todos.map((todo) => (
                <ListItem
                  key={todo._id}
                  sx={{
                    borderBottom: '1px solid #eee',
                    '&:last-child': { borderBottom: 'none' },
                  }}
                >
                  <Checkbox
                    checked={todo.completed}
                    onChange={() => handleToggle(todo._id, todo.completed)}
                  />
                  {editingTodo && editingTodo._id === todo._id ? (
                    <TextField
                      fullWidth
                      value={editingTodo.title}
                      onChange={(e) =>
                        setEditingTodo({ ...editingTodo, title: e.target.value })
                      }
                    />
                  ) : (
                    <ListItemText
                      primary={todo.title}
                      sx={{
                        textDecoration: todo.completed ? 'line-through' : 'none',
                      }}
                    />
                  )}
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => handleEdit(todo)}
                      sx={{ mr: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      onClick={() => handleDelete(todo._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          ) : (
            <Box 
              sx={{ 
                p: 4, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                gap: 2,
                color: 'text.secondary'
              }}
            >
              <PlaylistAddIcon sx={{ fontSize: 60, opacity: 0.5 }} />
              <Typography variant="h6" color="text.secondary">
                No todos yet
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                Add your first todo by typing in the box above and pressing Enter or clicking Add
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
}

export default App; 