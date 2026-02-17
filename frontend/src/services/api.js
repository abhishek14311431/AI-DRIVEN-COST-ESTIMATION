export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const estimateCost = async (requestData) => {
  try {
    // Add timeout to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    const response = await fetch(`${API_BASE_URL}/estimate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('Request timeout - backend may be unreachable');
      throw new Error('Request timed out. Please check if the backend is running.');
    }
    console.error('Error estimating cost:', error);
    throw error;
  }
};
