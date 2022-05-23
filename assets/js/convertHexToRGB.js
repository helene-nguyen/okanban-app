const converter = {
    /**
     * Convert RGB to Hexadecimal
     * @param {*} color 
     * @returns 
     */
    getHexFromRGB(color) {
        let a = color.split(",");
        let b = a.map(function (element) { //For each array element
            element = parseInt(element).toString(16); //Convert to a base16 string
            return (element.length == 1) ? "0" + element : element; //Add zero if we get only one character
        });
        return b = "#" + b.join("");
    }
};

export {
    converter
};