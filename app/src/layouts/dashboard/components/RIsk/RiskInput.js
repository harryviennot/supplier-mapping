import React, { useState } from 'react';
import Button from '@mui/material/Button';

function RiskInput({ nodeId, onSubmit }) {
    const [risk, setRisk] = useState("");
  
    const handleChange = (e) => {
      setRisk(e.target.value);
    };
  
    const handleSubmit = () => {
      localStorage.setItem(`risk-${nodeId}`, risk);
      onSubmit && onSubmit(risk);
    };
  
    return (
      <div>
        <input type="number" value={risk} onChange={handleChange} />
        <button onClick={handleSubmit}>Submit</button>
      </div>
    );
  }
  
  export default RiskInput;
  

