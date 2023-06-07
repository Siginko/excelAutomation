const excel = require('exceljs');
const {IndiaDate} = require('../utils/dates')


function Export(array, totalNet, totalVat, totalGross, dueDates, irns) {
    async (req, res, next) => {
    console.log('1')
    try{
    console.log('2')

    const wb = new excel.Workbook();
    const ws = wb.addWorksheet('MySheet');
    const today = new Date();

    console.log('irns:', irns)

    const name = getIrnName(irns) + `_dueDate_${IndiaDate(dueDates[0])}`;
    let fileName="";

    if(process.env.NODE_ENV !== "production"){
        fileName = `C:\\Users\\siget\\Desktop\\INR_GSI_${name}.xlsx`;
    }
    else{
        fileName = `INR_GSI_${name}.xlsx`
    }

    const sumArray = ['Segment_Id', 'Ctrycode', 'Compcode', 'File_Seq', 'Tot Rows', 'Total Amount', 'File date', 'Record Type']
    const totalArray = ['CTRL', '709', '70',,array.length, totalNet, IndiaDate(today), 'IB']
    const detailsArray = ['Supplier Name', 'Segment ID', 'Supplier Number', 'Invoice Number', 'IRN Number', 'Invoice Type', 'Rel Inv no.', 'IRN date (yyyymmdd)', 'Payment Due Date (yyyymmdd)', 'Invoice date (yyyymmdd)', 'Invoice Currency Code', 'Invoice Amount', 'VAT1 code', 'VAT1 amt', 'VAT2 code', 'VAT2 amt', 'VAT3 code', 'VAT3 amt', 'VAT4 code', 'VAT4 amt', 'Other Tax1 Code', 'Other Tax1 Amount', 'Other Tax2 Code', 'Other Tax2 Amount', 'Other Tax3 Code', 'Other Tax3 Amount', 'Payment Method', 'Bk/Add code', 'IBM Bank ID', 'Payment Document Number', 'VAT exch rate (for inv in FC & has VAT)', 'Local Data 1', 'Local Data 2', 'Local Data 5', 'Bill-from', 'Ship-to', 'Bill-to', 'Commodity Code', 'Item Description', 'Department Code', 'Item Amount', 'APPR No.', 'IGS Project No.', 'Prod ID', 'Non-IGS Proj no.', 'HSN/SAC code', 'Brand', 'Period', 'PAB No']
    
    ws.insertRow(5, sumArray);
    ws.insertRow(6, totalArray);
    ws.insertRow(9, detailsArray);

    ws.getCell('F6').fill = {
        type: 'pattern',
        pattern:'solid',
        fgColor: {argb:'ffcc99ff'},
    };

    ws.getRow(9).fill = {
        type: 'pattern',
        pattern:'solid',
        fgColor: {argb:'ff666699'},
      };

    ws.getRow(9).font = {
    color: {argb: 'ffffffff'},
    }

    for (let i = 0; i<array.length; i++){
        ws.insertRow(10+i,array[i])
    }

    const vatRow = [];
    vatRow[11] = "Total VAT:";
    vatRow[12] = totalVat;
    const grossRow = [];
    grossRow[11] = "Total Gross:";
    grossRow[12] = totalGross;
    ws.insertRow(10+1+array.length, vatRow);
    ws.insertRow(10+2+array.length, grossRow);
    console.log('3')
    await wb.xlsx.writeFile(fileName)
    save();

    }
    catch(e){
        console.log(e)
    }
}

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
}

module.exports = {Export}