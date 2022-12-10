import * as sql from "mssql";

export const config: sql.config = {
    user: 'sa',
    password: 'MyPassword1!',
    server: 'localhost',
    port: 1433,
    options: {
        trustServerCertificate: true
    }
}