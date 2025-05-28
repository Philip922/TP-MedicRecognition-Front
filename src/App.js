import React, { useState } from 'react';
import './App.css';

function App() {
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    setInfo(null);

    // Read file as base64
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Audio = reader.result.split(',')[1];

      try {
        const response = await fetch('http://127.0.0.1:8000/upload-audio', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ base64_audio: base64Audio }),
        });

        const data = await response.json();
        setInfo(data);
      } catch (error) {
        console.error('Error uploading file:', error);
      } finally {
        setLoading(false);
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="App">
      <h2>Upload MP3</h2>
      <input type="file" accept=".mp3" onChange={handleFileUpload} disabled={loading} />
      
      {loading && <div className="spinner"></div>}

      {info && (
        <div className="result">
          <h3>Patient Info</h3>
          <p><strong>Name:</strong> {info.patient_name}</p>
          <p><strong>ID:</strong> {info.patient_id}</p>
          <p><strong>Consultation Reason:</strong> {info.consultation_reason}</p>

          <h4>Symptoms</h4>
          <ul>
            {info.symptoms.map((symptom, index) => (
              <li key={index}>{symptom}</li>
            ))}
          </ul>

          <h4>Treatment</h4>
          <pre style={{
            background: '#f4f4f4',
            padding: '1rem',
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word',
            overflowX: 'auto',
          }}>
            {info.patient_treatment}
          </pre>

        </div>
      )}
    </div>
  );
}

export default App;
