import { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, CssBaseline, Box, Typography} from '@mui/material';
import "./displayPage.css"
import { useNavigate } from 'react-router-dom';
import HamburgerMenu from '../shared/hamburgerMenu';

interface AudioFile {
    _id: string;
    audioName: string;
    category: string;
    filePath: string;
}

interface AudioItemInterface {
    key: string;
    audio: AudioFile;
}

const Display = () => {
  const [audioFileList, setAudioFileList] = useState<AudioFile[]>([]);

  const menuLinks = [
    { id: 'upload', text: 'Upload New Audio', href: '../upload' },
    { id: 'management', text: 'User Management', href: '../management' },
  ];

  useEffect(() => {
    const fetchData = async () => {
        axios.get("http://localhost:5000/api/audio/get")
        .then((response) => {
            setAudioFileList(response.data);
        }).catch((error) => {
            console.log(`We have a server error`, error);
        });
    }
    fetchData();
  }, [])

  const fetchAudio = async (audioId: string) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/audio/get/${audioId}`, {
        responseType: 'blob'
      });
  
      const audioBlob = new Blob([response.data], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);
  
      const audioElement = document.getElementById(audioId) as HTMLAudioElement;
  
      if (audioElement) {
        audioElement.src = audioUrl;
      } else {
        console.error('Audio element not found.');
      }
    } catch (error) {
      console.error('Error fetching audio:', error);
    }
  };

  const AudioItem = ({audio}: AudioItemInterface) => {
    fetchAudio(audio._id);
    return (
        <p>
           <span>{audio.audioName} - {audio.category}</span>
            <audio id={audio._id} controls>
                {/* <source src={`http://localhost:5000/api/audio/get/${audio._id}`} type="audio/mpeg" /> */}
                Your browser does not support the audio element.
            </audio> 
        </p>
        
    );
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
            <Typography variant="h5">My Audio Library</Typography>
            <Box sx={{ mt: 5 }}>
              <div>
                {audioFileList.length > 0 ? (
                  <div>
                    {audioFileList.map(audio => (
                      <AudioItem 
                        key={audio._id} 
                        audio={audio} 
                      />
                    ))}
                  </div>
                ) : (
                  <p>No audio files available</p>
                )}
              </div>
            </Box>
          </Box>
        </Container>
      </div>
    </div>
  );
}

export default Display;
