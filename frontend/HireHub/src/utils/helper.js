export const validateEmail = (email) => {
    if (!email.trim()) return 'Email is required.';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address.';
    return '';
   
  }


  export const validatePassword = (password)=>{
    if(!password) return "Password is required"
    if(password.length<8) return "Password must be 8 character long"
    if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter";
    if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter";
    if (!/\d/.test(password)) return "Password must contain at least one digit";
    return '';
  }

  export const validateAvatar = (file) => {
    if (!file) return '';
    const allowedTypes = ['image/jpeg', 'image/png'];
    const maxSize = 2 * 1024 * 1024; // 2MB

    if (!allowedTypes.includes(file.type)) return 'Only JPG and PNG files are allowed';
    if (file.size > maxSize) return 'File size must be less than 2MB';
    return '';
}
