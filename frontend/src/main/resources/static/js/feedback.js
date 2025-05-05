// Feedback page functions
import { getFeedbackSummary, submitFeedback as submitFeedbackAPI } from './model.js';

let currentRating = 0;

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

// Initialize feedback page
async function initializeFeedbackPage() {
  if (!document.getElementById('feedbackForm')) return; // Not on feedback page

  try {
    // Fetch feedback summary from API
    const feedbackSummary = await getFeedbackSummary();

    if (feedbackSummary) {
      const averageRating = feedbackSummary.averageRating;
      const totalReviews = feedbackSummary.totalReviews;

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
    console.error('Failed to load feedback summary:', error);
    // Display error message (optional)
    // document.getElementById('averageRatingContainer').innerHTML = '<div class="alert alert-danger">Failed to load feedback summary. Please try again later.</div>';
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
    // Submit feedback to API
    const response = await submitFeedbackAPI(feedbackData);

    // Log response to console
    console.log('Feedback submitted:', response);

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

    // Refresh the feedback summary after submission (optional)
    initializeFeedbackPage();
  } catch (error) {
    console.error('Failed to submit feedback:', error);
    alert('Failed to submit feedback. Please try again later.');
  }
}

// Expose functions to the global scope
window.initializeFeedbackPage = initializeFeedbackPage;
window.setRating = setRating;
window.submitFeedback = submitFeedback;
