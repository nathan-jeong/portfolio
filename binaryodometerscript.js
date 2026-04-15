// Get elements from the DOM
const numberInput = document.getElementById('numberInput');
const fromBaseInput = document.getElementById('fromBase');
const toBaseInput = document.getElementById('toBase');
const resultBox = document.getElementById('resultBox');
const errorBox = document.getElementById('errorBox');

// Function to handle the conversion and update the UI
function convertAndDisplay() {
    const numberString = numberInput.value.trim();
    const fromBase = parseInt(fromBaseInput.value);
    const toBase = parseInt(toBaseInput.value);

    // Clear previous errors and result
    errorBox.textContent = '';
    resultBox.textContent = '0';
    resultBox.classList.remove('text-red-500');
    resultBox.classList.add('text-green-400');

    // --- Input Validation ---
    if (numberString === '') {
        return; // Do nothing if input is empty
    }

    if (isNaN(fromBase) || fromBase < 2 || fromBase > 36) {
        errorBox.textContent = 'Invalid "From Base". Must be a number between 2 and 36.';
        return;
    }

    if (isNaN(toBase) || toBase < 2 || toBase > 36) {
        errorBox.textContent = 'Invalid "To Base". Must be a number between 2 and 36.';
        return;
    }

    // --- Conversion Logic ---
    try {
        // First, convert the input number to base 10
        const base10Value = parseInt(numberString, fromBase);

        if (isNaN(base10Value)) {
            // This handles cases where the number string contains invalid digits for the specified base
            errorBox.textContent = `Invalid number format for base ${fromBase}.`;
            return;
        }

        // Then, convert the base-10 value to the target base
        const result = base10Value.toString(toBase).toUpperCase();

        // Update the result box with the converted value
        resultBox.textContent = result;
    } catch (e) {
        // Catch any other potential errors during conversion
        errorBox.textContent = 'An unexpected error occurred. Please check your inputs.';
        console.error(e);
    }
}

// Add event listeners to the input fields to trigger conversion
numberInput.addEventListener('input', convertAndDisplay);
fromBaseInput.addEventListener('input', convertAndDisplay);
toBaseInput.addEventListener('input', convertAndDisplay);

// Run on initial load to set the initial state
convertAndDisplay();