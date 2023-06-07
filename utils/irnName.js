function getIrnName (irnArray) {
    let name ="";

    for (let i = 0; i<irnArray.length; i++){
        if(i===0){
            name = name + irnArray[i];
        }
        else{
            let temp = irnArray[i].slice(-4);
            name = name + "_" + temp;
        }
    }

    return name
}


module.exports = {Export, getIrnName}