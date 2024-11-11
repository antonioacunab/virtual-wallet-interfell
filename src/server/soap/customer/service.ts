import { CustomServerResponse } from "../../../helpers/response";
import { throwIfNoValidString } from "../../../helpers/user-data";
import { MY_SQL_SERVICE       } from "../../../services/mysql";

export const SERVICE = {
    CustomerService: {
        CustomerPort: {
            createCustomer (args: any): Promise<CustomServerResponse>
            {
                const { document, name, email, phone } = args;

                try
                {
                    throwIfNoValidString(document);
                    throwIfNoValidString(name);
                    throwIfNoValidString(email);
                    throwIfNoValidString(phone);
                }
                catch (error: any)
                {
                    return Promise.resolve({
                        success: false,
                        code: 400,
                        message: `A customer could not be created: ${error.message}`,
                    });
                }

                const output: Promise<CustomServerResponse> = MY_SQL_SERVICE.query(
                    `INSERT INTO ${process.env.MYSQL_TABLE_NAME} (document, name, email, phone) VALUES ("${document}", "${name}", "${email}", "${phone}")`
                )
                    .then(() => {
                        return {
                            success: true,
                            code: 0,
                            message: "Customer created successfully",
                        };
                    })
                    .catch((error: any) => {
                        return {
                            success: false,
                            code: 500,
                            message: `A customer could not be created: ${error}`,
                        };
                    });

                return output;
            },
        }
    }
}