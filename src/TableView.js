import React, { useState, useEffect } from 'react';
import './TableView.css';
import { Link, useLocation } from 'react-router-dom';

function TableView() {
    const [header, setHeader] = useState('');
    const [dietData, setDietData] = useState([]);
    const [diseaseData, setDiseaseData] = useState([]);
    const location = useLocation();
    const { id } = location.state;

    const fetchData = async () => {
        console.log(id)
        const apiUrl = "http://presidiumludhiana.in:5030/api/v1/recipe/GetGeminiRecipes";
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            if (response.ok && data.data.length > 0) {
                const foodItem = data.data[0].details.food_item;
                setHeader(foodItem.name);
                setDietData([{
                    id: 1,
                    veg: foodItem.diet_suitability.vegetarian,
                    egg: foodItem.diet_suitability.eggetarian,
                    non_veg: foodItem.diet_suitability['non-vegetarian']
                }]);
                const healthConditions = data.data[0].details.health_condition_suitability;
                const transformedDiseaseData = Object.keys(healthConditions).map((key, index) => ({
                    id: index,
                    diseaseName: key,
                    suitability: !healthConditions[key].not_suitable,
                    no_suitability: healthConditions[key].not_suitable,
                    condition: healthConditions[key].conditional,
                }));
                setDiseaseData(transformedDiseaseData);
            } else {
                console.error("Failed to fetch data:", data);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDietCheckboxChange = (id, property) => (event) => {
        const newData = dietData.map(item => {
            if (item.id === id) {
                item[property] = event.target.checked;
            }
            return item;
        });
        setDietData(newData);
    };

    const handleDiseaseCheckboxChange = (id, property) => (event) => {
        const newData = diseaseData.map(item => {
            if (item.id === id) {
                item[property] = event.target.checked;
            }
            return item;
        });
        setDiseaseData(newData);
    };

    const handleUpdate = async () => {
        const apiUrl = `http://presidiumludhiana.in:5030/api/v1/recipe/updateGeminiRecipe/${id}`;

        // Prepare the data for update by modifying the fields based on the current state
        const updatedData = {
            diet_suitability: {
                vegetarian: dietData.find(item => item.id === 1).veg,
                non_vegetarian: dietData.find(item => item.id === 1).non_veg,
                eggetarian: dietData.find(item => item.id === 1).egg
            },
            health_condition_suitability: diseaseData.reduce((acc, item) => {
                acc[item.diseaseName] = {
                    suitable: item.suitability,
                    not_suitable: item.no_suitability,
                    conditional: item.condition
                };
                return acc;
            }, {})
        };

        try {
            const response = await fetch(apiUrl, {
                method: 'PUT', // Assuming the update operation is done via a PUT request
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedData)
            });

            const responseData = await response.json();
            if (response.ok) {
                console.log('Update successful:', responseData);
                alert('Data updated successfully!');
            } else {
                throw new Error('Failed to update data');
            }
        } catch (error) {
            console.error('Error updating data:', error);
            alert('Error updating data: ' + error.message);
        }
    };


    return (
        <div className="table-container">
            <h1 className='heading'>{header}</h1>
            <label>Food Id</label>
            <input type="nuber" value={id}  className="full-width-input" />

            <div className='diet-suitability'>
                <h2>Diet Suitability</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Veg</th>
                            <th>Egg</th>
                            <th>Non-Veg</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dietData.map(item => (
                            <tr key={item.id}>
                                <td><input type="checkbox" checked={item.veg} onChange={handleDietCheckboxChange(item.id, 'veg')} /></td>
                                <td><input type="checkbox" checked={item.egg} onChange={handleDietCheckboxChange(item.id, 'egg')} /></td>
                                <td><input type="checkbox" checked={item.non_veg} onChange={handleDietCheckboxChange(item.id, 'non_veg')} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className='disease-suitability'>
                <h2>Health Suitability</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Disease Name</th>
                            <th>Suitability</th>
                            <th>No Suitability</th>
                            <th>Condition</th>
                        </tr>
                    </thead>
                    <tbody>
                        {diseaseData.map(item => (
                            <tr key={item.id}>
                                <td>{item.diseaseName}</td>
                                <td><input type="checkbox" checked={item.suitability} onChange={handleDiseaseCheckboxChange(item.id, 'suitability')} /></td>
                                <td><input type="checkbox" checked={item.no_suitability} onChange={handleDiseaseCheckboxChange(item.id, 'no_suitability')} /></td>
                                <td><input type="checkbox" checked={item.condition} onChange={handleDiseaseCheckboxChange(item.id, 'condition')} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Link to='/'>
                <button type='button' style={{ marginTop: '10px', padding: '10px', borderRadius: '5px', background: 'black', color: 'white', cursor: 'pointer' }}>Go Back</button>
            </Link>
            <button type="button" style={{ marginTop: '10px' }} className="submitButton" onClick={handleUpdate}>Update</button>
        </div>
    );
}

export default TableView;
