/**
 * Convert color temperature (Kelvin) to RGB.
 * @param {number} kelvin - The color temperature in Kelvin (range 1000K to 40000K).
 * @returns {object} An object with r, g, b values.
 */
function kelvinToRgb(kelvin) {
    let temp = kelvin / 100; // Normalize temperature
    let red, green, blue;

    // Calculate red
    if (temp <= 66) {
        red = 255;
    } else {
        red = temp - 60;
        red = 329.698727446 * Math.pow(red, -0.1332047592);
        red = Math.min(Math.max(red, 0), 255); // Clamp value
    }

    // Calculate green
    if (temp <= 66) {
        green = temp;
        green = 99.4708025861 * Math.log(green) - 161.1195681661;
        green = Math.min(Math.max(green, 0), 255); // Clamp value
    } else {
        green = temp - 60;
        green = 288.1221695283 * Math.pow(green, -0.0755148492);
        green = Math.min(Math.max(green, 0), 255); // Clamp value
    }

    // Calculate blue
    if (temp >= 66) {
        blue = 255;
    } else if (temp <= 19) {
        blue = 0;
    } else {
        blue = temp - 10;
        blue = 138.5177312231 * Math.log(blue) - 305.0447927307;
        blue = Math.min(Math.max(blue, 0), 255); // Clamp value
    }

    return `${Math.round(red)},${Math.round(green)}, ${Math.round(blue)}`;
}

export default kelvinToRgb;