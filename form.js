// Get elements
const forms = document.querySelectorAll('form[data-form]');

// Check if form elements exist on page
if(forms.length > 0) {
  // Loop through forms
  for(let form of forms) {
    // Get all inputs with data-validate attribute
    const inputs = form.querySelectorAll('[data-validate]');

    // Submit form
    form.addEventListener('submit', submitForm.bind(form, inputs));

    // Loop through inputs
    inputs.forEach(input => {
      // Add input event type to all inputs and listen to inputChange function
      input.addEventListener('input', inputChange);
    });
  }
}

// Input change
function inputChange() {
  const input = this;
  validateInput(input);
}

// Validate input
function validateInput(input) {
  // Get the value and error element
  const value = input.value;
  const errorEl = input.closest('[data-formgroup]').querySelector('[data-formerror]');
  // Declare error variable and assign null value by default
  let error = null;
  
  // Check if input has data-required attribute and if the value is empty and if input is not radio or checkbox
  if((input.type !== 'radio' || input.type !== 'checkbox') && input.dataset.required !== undefined && value === '') {
    error = input.dataset.requiredMessage ? input.dataset.requiredMessage : 'This field is required';
    input.classList.add('error');
  }

  // Check if input is checkbox and if not checked
  if(input.type === 'checkbox' && !input.checked) {
    error = input.dataset.errorMessage ? input.dataset.errorMessage : 'This field is required';
  }

  // Check if input is radio
  if(input.type === 'radio') {
    // Get all radio inputs in a group
    const radios = input.closest('[data-formgroup]').querySelectorAll('input[type="radio"]');
    let isChecked = false;
    let errorMsg = '';

    // Loop through radio and check if any radio is checked and if it is set isChecked to true
    radios.forEach(radio => {
      if(radio.checked) {
        isChecked = true;
      }
      if(radio.dataset.errorMessage) {
        errorMsg = radio.dataset.errorMessage;
      }
    });

    if(!isChecked) {
      error = errorMsg !== '' ? errorMsg : 'This field is required';
    }
  }

  // Check if input has data-minlength attribute and if value length is smaller than this attribute value, if so show the error
  if(!error && input.dataset.minlength !== undefined && value.length < +input.dataset.minlength) {
    error = 
      input.dataset.minlengthMessage ? input.dataset.minlengthMessage : `Please enter at least ${input.dataset.minlength} characters`;
    input.classList.add('error');
  }

  // Check if input has data-maxlength attribute and if value length is greater than this attribute value, if so show the error
  if(!error && input.dataset.maxlength !== undefined && value.length > +input.dataset.maxlength) {
    error = 
      input.dataset.maxlengthMessage ? input.dataset.maxlengthMessage : `Only ${input.dataset.maxlength} characters allowed`;
    input.classList.add('error');
  }

  // Check if input has data-email attribute and if email is not valid
  if(!error && input.dataset.email !== undefined && !validateEmail(value)) {
    error = input.dataset.emailMessage ? input.dataset.emailMessage : 'Invalid email address';
    input.classList.add('error');
  }

  // Check if input has data-match attribute and if value is not equal to the value of the element with name attribute equal to this data-match attribute
  if(!error && input.dataset.match !== undefined && value !== input.closest('[data-form]').querySelector(`[name="${input.dataset.match}"]`).value){
    error = input.dataset.matchMessage ? input.dataset.matchMessage : 'Fields values are not the same';
    input.classList.add('error');
  }

  // Check if input has data-match-with attribute
  if(input.dataset.matchWith !== undefined) {
    // Get the input which has a name attribute equal to the value of data-match-with attribute
    const inputToMatch = input.closest('[data-form]').querySelector(`[name="${input.dataset.matchWith}"]`);
    // Get the error element of that input
    const inputToMatchError = inputToMatch.closest('[data-formgroup]').querySelector('[data-formerror]');

    // If values are equal remove error class from input and hide error element
    if(value === inputToMatch.value) {
      inputToMatch.classList.remove('error');
      inputToMatchError.style.display = 'none';
    }else { // Add error class to input and show error element
      inputToMatch.classList.add('error');
      inputToMatchError.style.display = 'block';
      inputToMatchError.innerText = inputToMatch.dataset.matchMessage || 'Fields values are not the same';
    }
  }

  // Check if input is file input and if has data-maxfilesize attribute and if file size is greater than the value of this attribute
  if(!error && input.type === 'file' && input.dataset.maxfilesize !== undefined && input.files[0].size > +input.dataset.maxfilesize * 1024) {
    error = input.dataset.maxfilesizeMessage ? input.dataset.maxfilesizeMessage : 'File is too large';
    input.classList.add('error');
  }

  // Check if input is file and if has data-allowed-types attribute and if file type is not equal to one of the values in data-allowed-types attribute
  if(!error && input.type === 'file' && input.dataset.allowedTypes !== undefined && !input.dataset.allowedTypes.includes(input.files[0].type.split('/')[1])) {
    error = input.dataset.allowedTypesMessage ? input.dataset.allowedTypesMessage : 'Invalid file type';
    input.classList.add('error');
  }

  // If there is no error remove error class from input, remove message from error element and hide it
  if(!error) {
    input.classList.remove('error');
    errorEl.innerText = '';
    errorEl.style.display = 'none';
  }else { // If there is error set error message and show error element 
    errorEl.innerText = error;
    errorEl.style.display = 'block';
  }

  return error;
}

// Submit form - on submit button click
function submitForm(inputs, e) {
  e.preventDefault();
  const errors = [];

  inputs.forEach(input => {
    const error = validateInput(input);
    if(error) {
      errors.push(error);
    }
  });

  if(errors.length === 0) {
    console.log('form is valid and can be submitted...');
  }
}

// validate email
function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}