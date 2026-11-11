// Event Listeners
document.querySelector("#zip").addEventListener("change", displayCity);
document.querySelector("#username").addEventListener("change", checkUsername);
document.querySelector("#signupForm").addEventListener("submit", validateForm);
document.querySelector("#state").addEventListener("change", loadCounties);
document.querySelector("#password").addEventListener("click", suggestPassword);
loadStates();




// Functions
//  Display City, Latitude, and Longitude from zip
async function displayCity() {
    try {
        let zipCode = document.querySelector("#zip").value;
        let zipError = document.querySelector("#zipError");
        let url = `https://csumb.space/api/cityInfoAPI.php?zip=${zipCode}`;
        let response = await fetch(url);
        let data = await response.json();

        if (data === false) {
            zipError.textContent = "Zip code not found";
            zipError.style.color = "red";
            document.querySelector("#city").textContent = "";
            document.querySelector("#latitude").textContent = "";
            document.querySelector("#longitude").textContent = "";
            return;
        }

        zipError.textContent = "";



        document.querySelector("#city").textContent = data.city;
        document.querySelector("#latitude").textContent = data.latitude;
        document.querySelector("#longitude").textContent = data.longitude;

    } catch (error) {
        document.querySelector("#city").textContent = "Unable to retrieve city";
        console.error(error);
    }
}

//  populate states menu
async function loadStates() {
    let stateMenu = document.querySelector("#state");

    stateMenu.textContent = "";

    let defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Select One";
    stateMenu.appendChild(defaultOption);

    try {
        let url = "https://csumb.space/api/allStatesAPI.php";
        let response = await fetch(url);
        let data = await response.json();

        for (let item of data) {
            let option = document.createElement("option");
            option.value = item.usps;
            option.textContent = item.state;
            stateMenu.appendChild(option);
        }
    } catch (error) {
        console.error(error);

        stateMenu.textContent = "";

        let errorOption = document.createElement("option");
        errorOption.value = "";
        errorOption.textContent = "Unable to load states";
        stateMenu.appendChild(errorOption);
    }
}
//  populate state counties
async function loadCounties() {
    let state = document.querySelector("#state").value;
    let countyMenu = document.querySelector("#county");
    countyMenu.textContent = "";

    if (state === "")
        return;

    try {
        let url = `https://csumb.space/api/countyListAPI.php?state=${state}`;
        let response = await fetch(url);
        let data = await response.json();

        for (let item of data) {
            let option = document.createElement("option");
            option.value = item.county;
            option.textContent = item.county;
            countyMenu.appendChild(option);
        }
    } catch (error) {
        console.error(error);
    }
}
// Suggest Password
async function suggestPassword() {
    try {
        let url = "https://csumb.space/api/suggestedPassword.php?length=8";
        let response = await fetch(url);
        let data = await response.json();
        document.querySelector("#passwordSuggestion").textContent =
            "Suggested password: " + data.password;
    } catch (error) {
        console.error(error);
    }
}


// Check Username Availability
async function checkUsername() {
    let username = document.querySelector("#username").value;
    let usernameError = document.querySelector("#usernameError");

    if (username.length === 0) {
        usernameError.textContent = "Username required";
        usernameError.style.color = "red";
        return false;
    }

    try {
        let url = `https://csumb.space/api/usernamesAPI.php?username=${username}`;
        let response = await fetch(url);
        let data = await response.json();

        if (data.available) {
            usernameError.textContent = "Username available!";
            usernameError.style.color = "green";
            return true;
        } else {
            usernameError.textContent = "Username taken";
            usernameError.style.color = "red";
            return false;
        }
    } catch (error) {
        usernameError.textContent = "Unable to check username";
        usernameError.style.color = "red";
        console.error(error);
        return false;
    }
}

// 5. Validate Form user and password
async function validateForm(event) {
    event.preventDefault();

    let isValid = true;

    // Username Validation
    let username = document.querySelector("#username").value;
    let usernameError = document.querySelector("#usernameError");
    usernameError.textContent = "";

    if (username.length === 0) {
        usernameError.textContent = "Username required";
        usernameError.style.color = "red";
        isValid = false;
    } else {
        let usernameAvailable = await checkUsername();
        if (usernameAvailable === false) {
            isValid = false;
        }
    }

    // Password Validation 
    let password = document.querySelector("#password").value;
    let passwordAgain = document.querySelector("#passwordAgain").value;
    let passwordError = document.querySelector("#passwordError");
    passwordError.textContent = "";

    if (password.length < 6) {
        passwordError.textContent = "Password must be at least 6 characters long.";
        passwordError.style.color = "red";
        isValid = false;
    } else if (password !== passwordAgain) {
        passwordError.textContent = "Passwords do not match.";
        passwordError.style.color = "red";
        isValid = false;
    }


    // if all valid, submit
    if (isValid) {
        document.querySelector("#signupForm").submit();
    }
}
