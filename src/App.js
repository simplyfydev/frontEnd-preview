import React, { useEffect, useState } from 'react';
import { Link, useNavigate, } from 'react-router-dom';
import './App.css';
import axios from 'axios';


function App() {
  const [textValue, setTextValue] = useState('');
  const [foodName, setFoodName] = useState(""); // State for the food name
  const [mongo_food_id, setMongo_food_id] = useState('')
  const navigate = useNavigate();

  const handleTextChange = (event) => {
    const data = JSON.parse(event.target?.value || "null")
    console.log({data})
    setTextValue(data?.details);
  };

  const handleFoodNameChange = (event) => {
    setFoodName(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const apiUrl = "http://presidiumludhiana.in:5030/api/v1/recipe/AddGeminiRecipe";

    const formData = {
      id: foodName?.id, // Assuming ID is assigned by the backend or is not needed
      food_name: foodName?.food_name,
      mongo_food_id,
      details: textValue
    };

    // console.log(formData)

    // return
    try {
      const response = await axios.post(apiUrl, formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = response?.data?.data
      console.log('Data posted successfully:', data);
      navigate('/table', { state: { id: data._id } });
      alert('Data submitted successfully!');
    } catch (error) {
      console.error('Error posting data:', error);
      alert('Failed to submit data.');
    }
  };

  // console.log({textValue})
  console.log({ textValue })

  const fetchData = async () => {
    try {

      const response = await axios.get('http://presidiumludhiana.in:5030/api/v1/Recipe/foodName');
      setFoodName(response?.data?.data);
      setMongo_food_id(response?.data?.data?._id)
    } catch (error) {
      console.error('Error fetching data: ', error);
      // Handle error here
    }
  };

  useEffect(() => {
    fetchData()
  }, [])

  const handleGoToTable = () => {
    navigate('/table', { state: { id: foodName?.id } });
  }


  // console.log({ mongo_food_id, textValue: JSON.parse(textValue || "null") })

  return (
    <div className="container">
      <h1 className="header">Enter Food Details</h1>
      <form onSubmit={handleSubmit}>
        <label>Food Name</label>
        <input type="text" value={foodName?.food_name} onChange={handleFoodNameChange} className="full-width-input" />
        <label>Food Id</label>
        <input type="nuber" value={foodName?.id} onChange={handleFoodNameChange} className="full-width-input" />

        <label>Food Description</label>
        <textarea
          onChange={handleTextChange}
          // value={textValue}
          className="full-width-textarea"
        />

        {/* <Link to='/table'> */}
        <button style={{ marginLeft: '10px' }} type="submit" className="submitButton">Submit</button>
        {/* </Link> */}
        {/* <Link to='/addNew'> */}
        <button style={{ marginLeft: '10px' }} type="submit" className="submitButton">Add New</button>
        {/* </Link> */}

        <button onClick={handleGoToTable} style={{ marginLeft: '10px' }} type="submit" className="submitButton">Go To Table</button>

      </form>
    </div>
  );
}

export default App;