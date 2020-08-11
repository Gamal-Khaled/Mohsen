export const validateEmail = (email: string) => {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    
    if (!email.length) {
        return "Please Enter Your Email.";
    } else if (!emailRegex.test(email)) {
        return "Please Enter a Valid Email."
    } else {
        return "";
    }
}

export const validatePassword = (password: string) => {
    if (!password.length) {
        return "Please Enter Your Password.";
    } else if (password.length < 6) {
        return "Password Should be at Least 6 Characters."
    } else {
        return "";
    }
}

export const isEmpty = (text: string, textName?: string) => {
    if (!text.length) {
        return `Please enter ${textName}.`;
    } else {
        return "";
    }
}

export const validateConfirmPassword = (password: string, confirmPassword: string) => {
    if (confirmPassword.length < 6) {
        return "Password Should be at Least 6 Characters."
    } else if (password != confirmPassword) {
        return "The password doesn't match";
    } else {
        return "";
    }
}

export const validatePhoneNumber = (phoneNumber: string) => {
    const isNumericRegex = /^[0-9]*$/g;
    
    if (!phoneNumber.length) {
        return "Please Enter Your Phone Number.";
    } else if (!isNumericRegex.test(phoneNumber) || phoneNumber.length < 10 || phoneNumber.length > 16) {
        return "Please Enter a Valid Phone Number."
    } else {
        return "";
    }
}

export const validateCountryCode = (countryCode: string) => {
    const countryCodeRegex = /([0-9]){1,3}$/g;
    
    if (!countryCode.length) {
        return "Please Enter the Country Code.";
    } else if (!countryCodeRegex.test(countryCode)) {
        return "Please Enter a Valid Country Code (country code should start with '+')."
    } else {
        return "";
    }
}

/^(\+)?([ 0-9]){10,16}$/g