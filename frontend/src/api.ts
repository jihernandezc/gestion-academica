import axios from 'axios';

const apiGatewayUrl = 'http://localhost:4000'; // URL del api-gateway

export const getCourses = async () => {
  try {
    const response = await axios.get(`${apiGatewayUrl}/courses`);
    return response.data;
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
};

// Otros métodos para interactuar con el api-gateway