
let currentRating = 0;
const API_BASE_URL = 'http://localhost:8082/api';
// Feedback Endpoints
const FEEDBACK_ENDPOINTS = {
    FEEDBACK_SUMMARY: `${API_BASE_URL}/feedback/summary`,
    SUBMIT_FEEDBACK: `${API_BASE_URL}/feedback`
};
// Set the rating when a star is clicked
function setRating(rating) {
    currentRating = rating;
    document.getElementById('ratingValue').value = rating;

    // Update star display
    const stars = document.querySelectorAll('#ratingStars i');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.className = 'bi bi-star-fill';
        } else {
            star.className = 'bi bi-star';
        }
    });
}

function getAuthToken() {
    // This is a placeholder. In a real application, you would get the token
    // from localStorage, sessionStorage, or a state management system.
    return localStorage.getItem('authToken'); // Example: getting from localStorage
}

function getAuthHeaders() {
    const token = getAuthToken();
    const headers = {
        'Content-Type': 'application/json'
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`; // Assuming JWT Bearer token
    }
    return headers;
}

async function handleApiResponse(response) {
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `API request failed with status ${response.status}`);
    }
    return response.json();
}

async function getFeedbackSummary() {
    try {
        const response = await fetch(FEEDBACK_ENDPOINTS.FEEDBACK_SUMMARY, {
            method: 'GET',
            headers: getAuthHeaders() // May or may not require auth depending on API
        });
        return handleApiResponse(response);
    } catch (error) {
        console.error('Failed to fetch feedback summary:', error);
        throw error;
    }
}

// Initialize feedback page
async function initializeFeedbackPage() {
    if (!document.getElementById('feedbackForm')) return; // Not on feedback page

    try {
        // Get feedback summary from the API
        const feedbackData = await getFeedbackSummary();

        if (feedbackData) {
            const averageRating = feedbackData.averageRating;
            const totalReviews = feedbackData.totalReviews;

            // Update the average rating text
            document.querySelector('#averageRatingContainer p').innerHTML =
                `<strong>${averageRating.toFixed(1)}</strong> out of 5 based on <strong>${totalReviews}</strong> reviews`;

            // Update the average rating stars
            const stars = document.querySelectorAll('#averageRatingStars i');
            stars.forEach((star, index) => {
                // For full stars
                if (index < Math.floor(averageRating)) {
                    star.className = 'bi bi-star-fill';
                }
                // For half stars
                else if (index === Math.floor(averageRating) && averageRating % 1 >= 0.5) {
                    star.className = 'bi bi-star-half';
                }
                // For empty stars
                else {
                    star.className = 'bi bi-star';
                }
            });
        }
    } catch (error) {
        console.error('Error fetching feedback summary:', error);
        // Optionally display an error message to the user
    }
}

async function submitFeedbackToAPI(feedbackData) {
    try {
        const response = await fetch(FEEDBACK_ENDPOINTS.SUBMIT_FEEDBACK, {
            method: 'POST',
            headers: getAuthHeaders(), // Submitting feedback may require auth
            body: JSON.stringify(feedbackData)
        });
        return handleApiResponse(response);
    } catch (error) {
        console.error('Failed to submit feedback:', error);
        throw error;
    }
}

// Submit feedback
async function submitFeedback() {
    // Get form values
    const rating = currentRating;
    const topic = document.getElementById('feedbackTopic').value;
    const text = document.getElementById('feedbackText').value;

    // Validate form
    if (rating === 0) {
        alert('Please select a rating');
        return;
    }

    if (!topic) {
        alert('Please select a feedback topic');
        return;
    }

    // Create feedback object
    const feedbackData = {
        rating: rating,
        topic: topic,
        text: text
    };

    try {
        // Submit feedback to the backend
        const response = await submitFeedbackToAPI(feedbackData);

        if (response.success) {
            // Show success message
            document.getElementById('feedbackSuccess').classList.remove('d-none');

            // Reset form
            setRating(0);
            document.getElementById('feedbackTopic').value = '';
            document.getElementById('feedbackText').value = '';

            // Hide success message after 5 seconds
            setTimeout(() => {
                document.getElementById('feedbackSuccess').classList.add('d-none');
            }, 5000);
        } else {
            // Show error message
            alert('Failed to submit feedback: ' + response.message);
        }
    } catch (error) {
        console.error('Error submitting feedback:', error);
        alert('An error occurred while submitting feedback. Please try again later.');
    }
}
