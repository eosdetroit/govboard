

export const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
};

export const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}