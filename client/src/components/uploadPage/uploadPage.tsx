import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, CssBaseline, Box, Typography, TextField, Button } from '@mui/material';
import {useDropzone} from 'react-dropzone'
import './uploadPage.css';
import { useNavigate } from 'react-router-dom';
import HamburgerMenu from '../shared/hamburgerMenu';

const Upload = () => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioName, setAudioName] = useState("");
  const [category, setCategory] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const navigate = useNavigate();

  type FileWithPreview = File & { preview: string };

  const menuLinks = [
    { id: 'display', text: 'Audio Library', href: '../display' },
    { id: 'management', text: 'User Management', href: '../management' },
  ];

  useEffect(() => {
    const userString = sessionStorage.getItem('currentUser');
    if (userString) {
      const user = JSON.parse(userString);
      setCurrentUserId(user._id);
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!audioFile || !audioName || !category) {
      alert('Please fill out all fields');
      return;
    }

    const formData = new FormData();
    formData.append('userId', currentUserId)
    formData.append('audioFile', audioFile);
    formData.append('audioName', audioName);
    formData.append('category', category);

    try {
      await axios.post('http://localhost:5000/api/audio/post', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate("../display");
    } catch (error) {
      console.error('Error uploading audio file:', error);
    }
  };
  
  const { getRootProps, getInputProps } = useDropzone({
    accept: {'audio/*': []},
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      setFiles(acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      })));
      setAudioFile(acceptedFiles[0])
    },
  });

  const filePreviews = files.map(file => (
    <div key={file.name}>
      <p>{file.name}</p>
    </div>
  ));
  

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
          <Typography variant="h5">Audio Upload</Typography>
          <Box sx={{ mt: 5 }}>
          <form>
            <div {...getRootProps({ className: 'dropzone' })}>
              <input {...getInputProps()} />
              <p>Drag 'n' drop some audio files here, or click to select files</p>
            </div>
            <aside>
              {filePreviews}
            </aside>
            <TextField
              margin="normal"
              required
              fullWidth
              id="audioName"
              label="Audio Name"
              name="audioName"
              autoFocus
              value={audioName}
              onChange={(e) => setAudioName(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="category"
              label="Category"
              name="category"
              autoFocus
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleSubmit}
            >
              Upload Audio
            </Button>
          </form>
          </Box>
        </Box>
      </Container>
      </div>
    </div>
  );
}

export default Upload;
