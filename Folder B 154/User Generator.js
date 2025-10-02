const userImage = document.getElementById('user-image');
const userName = document.getElementById('user-name');
const userEmail = document.getElementById('user-email');
const userLocation = document.getElementById('user-location');
const userPhone = document.getElementById('user-phone');
const userAgeValue = document.getElementById('user-age-value');
const userGenderValue = document.getElementById('user-gender-value');
const userDobValue = document.getElementById('user-dob-value');
const generateButton = document.getElementById('generate-button');
const nationalitySelect = document.getElementById('nationality');
const apiUrl ='https://randomuser.me/api/';
async function generateUser() {
    try {
        let apiCall = apiUrl;
        const nationality = nationalitySelect.ariaValueMax;

        if (nationality) {
            apiCall += `nat=${nationality}`;
        }
        const response = await fetch(apiCall);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            const user = data.results[0];
            userImage.src = user.picture.large;
            userName.textContent = `${user.name.first} ${user.name.last}`;
            userEmail.textContent = user.email;
            userLocation.textContent = `${user.location.city}, ${user.location.country}`;
            userPhone.textContent = user.phone;
            userAgeValue.textContent = user.dob.age;
            userGenderValue.textContent = user.gender;
            userDobValue.textContent = new Date(user.dob.date).toLocaleDateString();
        } else {
            console.error('No Results Found in API Response.');
        }
    } catch (error) {
        console.error('Error Fetching User Data:', error);
        userName.textContent = 'Error at Loading User';
        userEmail.textContent = '';
        userLocation.textContent = '';
        userPhone.textContent = '';
        userAgeValue.textContent = '';
        userGenderValue.textContent = '';
        userDobValue.textContent = '';
        userImage.src = 'Empty Profile Pic.png';
    }
}
generateButton.addEventListener('click', generateUser);
generateUser();