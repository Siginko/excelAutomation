const moment = require ('moment');

let currentDate = new Date();
let tomorrowDate = new Date();
tomorrowDate.setDate(currentDate.getDate()+1);
tomorrowDate.setHours(0,0,0,0)

function DateFormat (date) {
    return moment(date).format('YYYY-MM-DD');
    };

function IndiaDate (date) {
    return moment(date).format('YYYYMMDD');
    };

module.exports = {currentDate, tomorrowDate, DateFormat, IndiaDate}