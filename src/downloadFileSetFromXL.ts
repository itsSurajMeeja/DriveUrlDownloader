const fs = require('fs');
let xlsx = require('node-xlsx');
const baseUrlValue = 'https://docs.google.com/uc?export=download&id=';
const filePath = '/hub.xlsx';
let baseFileData = xlsx.parse(fs.readFileSync(__dirname + filePath));

async function downloadPDFFileFromGivenUrl(baseUrl,url,name) {
    if (url) {
        const finalUrl = `${baseUrl}${url}`;
        const pdfRespone = await fetch(finalUrl);
        const pdfBuffer = await pdfRespone.arrayBuffer();
        const binaryPdf = Buffer.from(pdfBuffer);
        // If your file is not in pdf format you can change the extension here and file will be download to that extention.
        fs.writeFileSync(`${name}.pdf`, binaryPdf, 'binary');
    }
}

async function processBaseFile() {
    try {
        // First loop reads the file if one XL containing muliple files. 
        for (let fileCount = 0; fileCount < baseFileData.length; fileCount++) {
            // Select file to process.
            const fileDt = baseFileData[fileCount].data;
            
            // Read the file contents and process it.
            for (let index = 0; index < fileDt.length; index++) {
                // console.log('LOGGED DATA: \n\n', fileDt[index][0]);
                if(index === 2) {
                    break;
                }
                // Read the file and check if url is valid or not.
                if (fileDt[index] && fileDt[index][0] && typeof fileDt[index][0].includes == 'string' && fileDt[index][0].includes('https')) {
                    // Select file name from XL file.
                    const name = fileDt[index][1];
                    
                    // Get the file id used to download the file.
                    const url = fileDt[index] && fileDt[index][0] && fileDt[index][0].split('d/')[1] && fileDt[index][0].split('d/')[1].substring(0, 33) ? fileDt[index][0].split('d/')[1].substring(0, 33) : null;
                    if(url && url.length > 34) {
                        continue;
                    }
                   await downloadPDFFileFromGivenUrl(baseUrlValue,url, name);
                }
            }
        }
    } catch (error) {
        console.log(error);
    }

}
processBaseFile().then();