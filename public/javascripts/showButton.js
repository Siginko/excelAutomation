const checkBox = document.getElementsByName('invoice[exportStatus]');
const button = document.getElementById('myButton');

const values = [];

for (let i = 0; i < checkBox.length; i++){
    checkBox[i].addEventListener("change", function (e){
        if(checkBox[i].checked === true){
            values.push(checkBox[i].value)
        } else {
            const index = values.indexOf(checkBox[i]);
            values.splice(index, 1);
        };

        if (values.length === 0){
            button.disabled = true
        } else {
            button.disabled = false
        }
    }
)};
