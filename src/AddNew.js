import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Updated import
import './App.css';

function AddNew() {
  const [textValue, setTextValue] = useState('');
  const [foodName, setFoodName] = useState('');
  const navigate = useNavigate(); // Use the useNavigate hook

  const handleTextChange = (event) => {
    setTextValue(event.target.value);
  };

  const handleFoodNameChange = (event) => {
    setFoodName(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Submitted Text:", textValue);

    const apiUrl = "http://presidiumludhiana.in:5030/api/v1/recipe/AddGeminiRecipe";
    const data = JSON.stringify({
      id: '', // Assuming ID is assigned by the backend or is not needed
      food_name: foodName,
      details: {
        textValue
      }
    });

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: data,
      });

      const responseData = await response.json();
      if (response.ok) {
        console.log("Server Response:", responseData);
        navigate('/table'); // Updated navigation call
      } else {
        console.error("Server Error:", responseData);
      }
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  return (
    <div className="container">
      <h1 className="header">Enter Food Details</h1>
      <form onSubmit={handleSubmit}>
        <label>Food Name</label>
        <input type="text" value={foodName} onChange={handleFoodNameChange} className="full-width-input"/>

        <label>JSON Data</label>
        <textarea
          onChange={handleTextChange}
          value={textValue}
          className="full-width-textarea"
        />
        
        <Link to='/'>
        <button style={{marginLeft: '10px'}} type="submit" className="submitButton">Submit</button>
        </Link>
        <Link to='/'>
        <button  type="submit" className="submitButton">Back</button>
        </Link>
      </form>
    </div>
  );
}

export default AddNew;
