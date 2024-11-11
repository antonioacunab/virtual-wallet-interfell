import {
         MySQLDatatableService,
         MY_SQL_SERVICE,
       } from "./mysql";

describe("Module: mysql", function ()
{
    describe("Class: MySQLDatatableService", function ()
    {
        test("Method: create", function ()
        {
            const DATABASE_HOST    : string = process.env.MYSQL_HOST     || "";
            const DATABASE_USER    : string = process.env.MYSQL_USER     || "";
            const DATABASE_PASSWORD: string = process.env.MYSQL_PASSWORD || "";
            const DATABASE_NAME    : string = process.env.MYSQL_DATABASE || "";

            let mysqlService: MySQLDatatableService;

            // This will create a singleton
            expect(() => mysqlService = MySQLDatatableService.create(DATABASE_HOST, DATABASE_USER, DATABASE_PASSWORD, DATABASE_NAME)).not.toThrow();

            // The instance is expected to be the same every time that the method "create" is called
            expect(mysqlService!).toStrictEqual(MY_SQL_SERVICE);
        });

        // TODO: Añadir pruebas para el método "query".
    });
});