

export const formatDate = (dateString) => {
    if(dateString){
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }
    return "";
};

export const formatTime = (dateString) => {
    if(dateString){
        return new Date(dateString).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }
    return ""
}