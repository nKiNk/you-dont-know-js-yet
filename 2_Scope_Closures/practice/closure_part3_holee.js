function formatTotal(display) {
    if (Number.isFinite(display)) {
        // constrain display to max 11 chars
        let maxDigits = 11;
        // reserve space for "e+" notation? 
        if (Math.abs(display) > 99999999999) {
            maxDigits -= 6; 
        }
        // reserve space for "-"?
        if (display < 0) { 
             maxDigits--;
        }

        // whole number?
        if (Number.isInteger(display)) { 
            display = display
                .toPrecision(maxDigits) 
                .replace(/\.0+$/,"");
        }
        // decimal
        else {
            // reserve space for "." 
            maxDigits--;
            // reserve space for leading "0"? 
            if (
                Math.abs(display) >= 0 &&
                Math.abs(display) < 1 
            ){
                maxDigits--; 
            }
            display = display 
                .toPrecision(maxDigits) 
                .replace(/0+$/,"");
            } 
        }
        else {
            display = "ERR";
        }
    return display; 
}
function calculator() { 
    let total = 0;
    let nbr = "";
    let operator = '';
    let is_equal = 0;
    
    return function calc(key) {
        if (is_equal) {
            is_equal = 0;
            if (is_number(key)) {
                total = 0;
                operator = '';
            }
        }
        if (is_number(key)) {
            nbr += key;
            return (key);
        }
        if (is_operator(key)) {
            if (operator === '') {
                total = Number(nbr);
                nbr = "";
                return (operator = key);
            }
            total = calc_operator(total, operator, Number(nbr));
            nbr = "";
            return (operator = key);
        }
        if (key === '=') {
            if (operator === '') {
                total = Number(nbr);
            } else {
                total = calc_operator(total, operator, Number(nbr));
                is_equal = 1;
                nbr = "";
            }
            return (formatTotal(total));
        }
        return "";
    }
    
    function is_number(str) {
        if (str >= '0' && str <= '9')
            return (true);
        return (false);
    }
    
    function is_operator(str) {
        if (str === '+' || str === '-'
        || str === '/' || str === '%'
        || str === '*')
            return (true);
        return (false);
    }
    
    function calc_operator(total, operator, num) {
        let result = 0;
        
        if (operator === '+')
            result = total + num;
        if (operator === '/')
            result = total / num;
        if (operator === '%')
            result = total % num;
        if (operator === '-')
            result = total - num;
        if (operator === '*')
            result = total * num;
        return (result);
    }
}

var calc = calculator();

function useCalc(calc, keys) { 
    return [...keys].reduce(
        function showDisplay(display, key){ 
            var ret = String( calc(key) ); 
            return (
                display + 
                (
                  (ret != "" && key == "=") ?
                      "=" :
                      ""
                  )+
                  ret 
            );
        },
        ""
    ); 
}

console.log(useCalc(calc,"4+3="));    // 4+3=7
console.log(useCalc(calc,"+9="));     // +9=16
console.log(useCalc(calc,"*8="));     // *5=128
console.log(useCalc(calc,"7*2*3="));  // 7*2*3=42
console.log(useCalc(calc,"1/0="));    // 1/0=ERR
console.log(useCalc(calc,"+3="));     // +3=ERR
console.log(useCalc(calc,"51="));     // 51