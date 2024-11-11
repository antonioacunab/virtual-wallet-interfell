# Virtual Wallet - Interfell

Virtual Wallet is a web service that provides access to different different functionalities related to a virtual wallet such as: Creating a customer, getting the account balance, adding funds to the wallet and performing payments with token validation.

## Requirements

### Environment

Ensure that you have `node.js` version `v20.17.0` installed. Then, install dependencies:

```bash
npm install
```

Install `ts-node` globally

```bash
npm install ts-node -g
```

Also, ensure to create a `.env` file containing the following variables:

- MYSQL_HOST: The host were the database is located
- MYSQL_USER: The username
- MYSQL_PASSWORD: The password associated to the username
- MYSQL_DATABASE: The name of the database to be used
- MYSQL_TABLE_NAME: The name of the table into the database

You can also modify the following variables in case you need it:

- REST_PORT: Port where the rest server will be executed. Defaults to 3000
- SOAP_PORT: Port where the rest server will be executed. Defaults to 8000
- SOAP_CUSTOMERS_SERVER_LOCATION: URL where the customers SOAP server is located. Defaults to http://localhost:8000/customers?wsdl
- SOAP_WALLET_SERVER_LOCATION: URL where the wallet SOAP server is located. Defaults to http://localhost:8000/wallet?wsdl

### Database

Ensure that you have a MySQL database with a table as follow:

| Field    | Type        | Null | Key | Default | Extra |
|----------|-------------|------|-----|---------|-------|
| document | varchar(20) | NO   | PRI | NULL    |       |
| name     | varchar(50) | NO   |     | NULL    |       |
| email    | varchar(50) | NO   |     | NULL    |       |
| phone    | varchar(20) | NO   |     | NULL    |       |
| funds    | int         | NO   |     | 0       |       |

## REST Service

In order to start the REST server, run the command

```bash
npm run start:rest
```

The server will be available at http://localhost:3000/. In case you want to use a different port, set the environment variable `REST_PORT`.

## Messages for REST Service

You can use the following sample messages to check the behavior of the REST server

### Customers

The customers service is available at http://localhost:3000/customers. In order to get a response from the service, you must make a `POST` request, ensuring that the header `Content-Type` has the value `application/json`.

#### Creating a customer

Make a POST request to http://localhost:3000/customers/create

```json
{
	"document": "1234567890",
	"name": "John Doe",
	"email": "johndoe@example.com",
	"phone": "3123456789"
}
```

### Wallet

The customers service is available at http://localhost:3000/wallet. In order to get a response from the service, you must make a `POST` request, ensuring that the header `Content-Type` has the value `application/json`.

#### Getting the wallet balance

Make a POST request to http://localhost:3000/wallet/balance

```json
{
	"document": "1234567890",
	"phone": "3123456789"
}
```

#### Adding funds

Make a POST request to http://localhost:3000/wallet/addFunds

```json
{
	"document": "1234567890",
	"phone": "3123456789",
	"amount": 50000
}
```

#### Paying a purchase

Make a POST request to http://localhost:3000/wallet/pay

```json
{
	"document": "1234567890",
	"phone": "3123456789",
	"purchaseValue": 50000
}
```

#### Confirming a payment

Make a POST request to http://localhost:3000/wallet/confirmPay

```json
{
	"sessionId": "123456789011",
	"userToken": "961085"
}
```

Keep in mind that `sessionId` and `userToken` must be obtained from the response of the endpoint http://localhost:3000/wallet/pay and they have an expiration time of 60 seconds by default. To modify the expiration time, set the variable `TOKEN_EXPIRATION` in milliseconds, i.e. `120000` for an expiration time of two minutes.

## SOAP Service

In order to start the SOAP server, run the command

```bash
npm run start:soap
```

The server will be available at http://localhost:8000/. In case you want to use a different port, set the environment variable `SOAP_PORT`.

## Messages for SOAP Service

You can use the following sample messages to check the behavior of the SOAP server

### Customers

The customers service is available at http://localhost:8000/customers. In order to get a response from the service, you must make a `POST` request to this endpoint, ensuring that the header `Content-Type` has the value `text/xml` and the body of the request has the following format:

#### Creating a customer

```xml
<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">
    <Body>
        <createCustomer xmlns="http://www.example.org/createCustomer">
            <document>1234567890</document>
            <name>John Doe</name>
            <email>johndoe@example.com</email>
            <phone>3123456789</phone>
        </createCustomer>
    </Body>
</Envelope>
```

### Wallet

The wallet service is available at http://localhost:8000/wallet. In order to get a response from the service, you must make a `POST` request to this endpoint, ensuring that the header `Content-Type` has the value `text/xml` and the body of the request has the following format:

#### Getting the wallet balance

```xml
<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">
    <Body>
        <getBalance xmlns="http://www.example.org/getBalance">
            <document>1234567890</document>
            <phone>3123456789</phone>
        </getBalance>
    </Body>
</Envelope>
```

#### Adding funds

```xml
<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">
    <Body>
        <addFunds xmlns="http://www.example.org/addFunds">
            <document>1234567890</document>
            <phone>3123456789</phone>
            <amount>500000</amount>
        </addFunds>
    </Body>
</Envelope>
```

#### Paying a purchase

```xml
<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">
    <Body>
        <pay xmlns="http://www.example.org/pay">
            <document>1234567890</document>
            <phone>3123456789</phone>
            <purchaseValue>50000</purchaseValue>
        </pay>
    </Body>
</Envelope>
```

#### Confirming a payment

```xml
<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">
  <Body>
    <confirmPay xmlns="http://www.example.org/confirmPay">
      <sessionId>nc32897c23c329n</sessionId>
      <userToken>123456</userToken>
    </confirmPay>
  </Body>
</Envelope>
```