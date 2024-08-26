const express = require('express');
const { sql, poolPromise } = require('./db');
const app = express();
const port =  80;

app.use(express.json());


app.get('/', async (req,res)=>{
res.send("hi")});

app.get('/PAN/:PANNumber', async (req, res) => {
    const PAN_Number = req.params.PANNumber;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('PAN_Number', sql.VarChar, PAN_Number) // Assuming AccountID is an integer
            // 
            .query('SELECT * FROM config.[Account] WHERE PANNo = @PAN_Number');
    

const innerarray = result.recordsets[0];
            const Data = innerarray.map(e => {

                return{
                    "Account ID": e.AccountID,  // Renaming "AccountID" to "accountID"
                    "Account Name": e.AcName,   // Renaming "AcName" to "accountName"
                }
            })


            const beautifiedJSON = JSON.stringify(Data, null, 2);
            
            res.setHeader('Content-Type', 'application/json');
            
            res.send(beautifiedJSON);


    } catch (err) {
        res.status(500).send('Database query failed');
    }
});



// Example POST endpoint
// app.post('/api/data', async (req, res) => {
//     const { column1, column2 } = req.body; // Adjust this to match your table columns
//     try {
//         const pool = await poolPromise;
//         await pool.request()
//             .input('column1', sql.VarChar, column1)
//             .input('column2', sql.VarChar, column2)
//             .query('INSERT INTO YourTableName (Column1, Column2) VALUES (@column1, @column2)');
//         res.status(201).send('Record inserted');
//     } catch (err) {
//         res.status(500).send('Database insertion failed');
//     }
// });


app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
});
