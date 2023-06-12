// AudioTextField.jsx
import React, { useState, useEffect, useRef, useContext } from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';
import { CircularProgress } from '@mui/material';
import { Buffer } from 'buffer';
import { styled } from '@mui/system';
import { functions } from '../../firebaseConfig';
import { httpsCallable } from 'firebase/functions';
import { collection, addDoc } from "@firebase/firestore";
import { db } from "../../firebaseConfig";
import { AuthContext } from "../../auth/auth";

// Initialize Firebase function
const transcribeAudio = httpsCallable(functions, 'transcribeAudioFileOnRequest');

// Style the recording dot
const RecordingDot = styled('span')({
    height: '10px',
    width: '10px',
    backgroundColor: 'red',
    borderRadius: '50%',
    display: 'inline-block',
    marginLeft: '5px',
});

const AudioTextField = () => {
    const [text, setText] = useState('');
    const [recording, setRecording] = useState(false);
    const [loading, setLoading] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const chunksRef = useRef([]);
    const {user} = useContext(AuthContext);

    useEffect(() => {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            console.log('getUserMedia not supported on your browser!');
        } else {
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then((stream) => {
                    const newMediaRecorder = new MediaRecorder(stream);
                    newMediaRecorder.ondataavailable = (e) => {
                        chunksRef.current.push(e.data);
                    };
                    newMediaRecorder.onstop = async () => {
                        const blob = new Blob(chunksRef.current, { 'type': 'audio/ogg; codecs=opus' });
                        console.log('Size of the audio file: ', blob.size);
                        // convert blob to base64 to send to Firebase function
                        const audioData = await blob.arrayBuffer();
                        const base64Audio = Buffer.from(audioData).toString('base64');
                        try {
                            const result = await transcribeAudio({ audioBytes: base64Audio });
                            setText(result.data.transcription);
                        } catch (err) {
                            console.error('Error calling transcription function:', err);
                        }
                        chunksRef.current = []; // clear chunks for next recording
                        setLoading(false); // Set loading to false after transcription is done
                    };
                    setMediaRecorder(newMediaRecorder);
                })
                .catch((err) => {
                    console.log('Error occurred while trying to get user media:', err);
                });
        }
    }, []);

    const startRecording = () => {
        if (!mediaRecorder) return;
        setRecording(true);
        chunksRef.current = []; // clear chunks for new recording
        mediaRecorder.start();
    };

    const stopRecording = () => {
        if (!mediaRecorder) return;
        setRecording(false);
        setLoading(true); // Set loading to true when you stop recording and begin transcribing
        mediaRecorder.stop();
    };

    const handleAudioRecord = () => {
        if (recording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    // const handleSend = () => {
    //     // TODO: Implement sending of the text. For now, we'll just log it.
    //     console.log(text);
    //     setText('');
    // };

    const handleSend = async (event) => {
        if (event.key !== "Enter" && event.type !== "click") {
          return;
        }
    
        try {
          // Reset text input immediately after Firestore document creation
          setText("");

          // Create a Firestore document
          const mediaCollectionRef = collection(db, "media");
          await addDoc(mediaCollectionRef, {
            userId: user.uid,
            type: "text",
            text: text,
            title: "Untitled",
            createdAt: new Date(),
            updatedAt: new Date(),
            timestamp: new Date(),
          });
          
    
          console.log("Text uploaded successfully");
        } catch (error) {
          console.error("Error uploading text:", error);
        }
      };

    return (
        <TextField
            fullWidth
            variant="outlined"
            value={text}
            onChange={e => setText(e.target.value)}
            multiline
            rowsMax={4}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton onClick={handleAudioRecord}>
                            <MicIcon />
                            {recording && <RecordingDot />}
                            {loading && <CircularProgress size={24} />} 
                        </IconButton>
                        <IconButton onClick={handleSend}>
                            <SendIcon />
                        </IconButton>
                    </InputAdornment>
                ),
            }}
        />
    );
};

export default AudioTextField;
