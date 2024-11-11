# Virtual Wallet - Interfell

Virtual Wallet is a web service that provides access to different different functionalities related to a virtual wallet such as: Creating a customer, getting the account balance, adding funds to the wallet and performing payments with token validation.

## REST Service

In order to start the REST server, run the command

```bash
npm run start:rest
```

The server will be available at http://localhost:3000/. In case you want to use a different port, set the environment variable REST_PORT.

## SOAP Service

In order to start the SOAP server, run the command

```bash
npm run start:soap
```

The server will be available at http://localhost:8000/. In case you want to use a different port, set the environment variable SOAP_PORT.

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