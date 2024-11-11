import type {
              Connection,
              QueryError,
              QueryResult,
            } from "mysql2";

import { createConnection } from "mysql2";

import { throwIfNoValidString } from "../helpers/user-data";

export class MySQLDatatableService
{
    protected static instance: MySQLDatatableService | undefined;

    static create (host: string, user: string, password: string, database: string): MySQLDatatableService
    {
        throwIfNoValidString(host);
        throwIfNoValidString(user);
        throwIfNoValidString(password);

        if (MySQLDatatableService.instance == null)
            MySQLDatatableService.instance = new MySQLDatatableService(host, user, password, database);

        return MySQLDatatableService.instance;
    }

    protected connection: Connection;

    protected isConnected: boolean = false;

    protected constructor (host: string, user: string, password: string, database: string)
    {
        this.connection = createConnection({
            host,
            user,
            password,
            database,
        });
    }

    protected async connect (callback?: Function): Promise<void>
    {
        this.connection.connect((error: QueryError | null) => {
            if (error)
                throw new Error(`An error ocurred while trying to connect to the database: ${error.message}`);

            console.log(`Database connection completed. Connection ID: ${this.connection.threadId}`);

            this.isConnected = true;

            if (callback)
                callback();
        });
    }

    async query (query: string): Promise<QueryResult>
    {
        return await new Promise((resolve, reject) => {
            const queryCall = () => this.connection.query(query, (error: QueryError | null, result: QueryResult) => {
                if (error)
                    reject(error.message);

                resolve(result);
            });

            if ( !this.isConnected )
                return this.connect(queryCall);

            return queryCall();
        });
    }
}

// Load the environment variables when the module is called
process.loadEnvFile(".env");

const DATABASE_HOST    : string = process.env.MYSQL_HOST     || "";
const DATABASE_USER    : string = process.env.MYSQL_USER     || "";
const DATABASE_PASSWORD: string = process.env.MYSQL_PASSWORD || "";
const DATABASE_NAME    : string = process.env.MYSQL_DATABASE || "";

export const MY_SQL_SERVICE: MySQLDatatableService = MySQLDatatableService.create(DATABASE_HOST, DATABASE_USER, DATABASE_PASSWORD, DATABASE_NAME);