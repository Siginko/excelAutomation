function CalculateTax (code, amount, percentage){
    if (code === ""){
        return ""
    } else {
        return ((amount/100)*percentage).toFixed(2);
    }
    };

module.exports = {CalculateTax}