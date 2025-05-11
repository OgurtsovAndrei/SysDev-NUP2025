import {getFeedbackSummary, submitFeedback as submitFeedbackAPI} from './model.js';

let currentRating = 0;

function setRating(rating) {
    currentRating = rating;
    document.getElementById('ratingValue').value = rating;

    const stars = document.querySelectorAll('#ratingStars i');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.className = 'bi bi-star-fill';
        } else {
            star.className = 'bi bi-star';
        }
    });
}

async function initializeFeedbackPage() {
    if (!document.getElementById('feedbackForm')) return;

    try {
        const feedbackSummary = await getFeedbackSummary();

        if (feedbackSummary) {
            const averageRating = feedbackSummary.averageRating;
            const totalReviews = feedbackSummary.totalReviews;

            document.querySelector('#averageRatingContainer p').innerHTML =
                `<strong>${averageRating.toFixed(1)}</strong> out of 5 based on <strong>${totalReviews}</strong> reviews`;

            const stars = document.querySelectorAll('#averageRatingStars i');
            stars.forEach((star, index) => {
                if (index < Math.floor(averageRating)) {
                    star.className = 'bi bi-star-fill';
                } else if (index === Math.floor(averageRating) && averageRating % 1 >= 0.5) {
                    star.className = 'bi bi-star-half';
                } else {
                    star.className = 'bi bi-star';
                }
            });
        }
    } catch (error) {
        console.error('Failed to load feedback summary:', error);
    }
}

async function submitFeedback() {
    const rating = currentRating;
    const topic = document.getElementById('feedbackTopic').value;
    const text = document.getElementById('feedbackText').value;

    if (rating === 0) {
        alert('Please select a rating');
        return;
    }

    if (!topic) {
        alert('Please select a feedback topic');
        return;
    }

    const feedbackData = {
        rating: rating,
        topic: topic,
        text: text
    };

    try {
        const response = await submitFeedbackAPI(feedbackData);

        console.log('Feedback submitted:', response);

        document.getElementById('feedbackSuccess').classList.remove('d-none');

        setRating(0);
        document.getElementById('feedbackTopic').value = '';
        document.getElementById('feedbackText').value = '';

        setTimeout(() => {
            document.getElementById('feedbackSuccess').classList.add('d-none');
        }, 5000);

        initializeFeedbackPage();
    } catch (error) {
        console.error('Failed to submit feedback:', error);
        window.location.href = 'index.html';
    }
}

window.initializeFeedbackPage = initializeFeedbackPage;
window.setRating = setRating;
window.submitFeedback = submitFeedback;
