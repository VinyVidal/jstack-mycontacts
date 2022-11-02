const { createPool } = require('mysql2');

const connectionData = {
    host     : 'localhost',
    port     : 3306,
    user     : 'root',
    password : '',
    database : 'mycontacts'
};

exports.query = async (query, values) => {
    const pool = createPool(connectionData);
    const promisePool = pool.promise();
    const [rows, fields] = await promisePool.query(query, values);
    return rows;
}


// connection.query('SELECT * FROM contacts', (error, results, fields) => console.log(results));