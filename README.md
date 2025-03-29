[🔗 Accompanying Google Doc for other written responses](https://docs.google.com/document/d/11eMxDFI9Wqoo0s4WnFeV7ZcQGJHrZjw0JiUKoHgO0ew/edit?usp=sharing)

# Dynamic Demo App

This project was bootstrapped with [Create Dynamic App](https://docs.dynamic.xyz/example-apps). The commit history has setup notes if you'd like to replicate from scratch.

## Prerequisites

- [Node.js and npm](https://nodejs.org/) for the React application
- [PHP 7.4 or higher](https://www.php.net/downloads) (for the JWT verification API)
- [Composer](https://getcomposer.org/download/) (for PHP dependencies)

## Local Testing

`/src/` contains a React app to render the front end.

- Run `npm i` to install dependencies.
- Run `npm start` to start the front end server.
- Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

`/api/` contains a PHP server for the back end that verifies JWTs issued by Dynamic.

- Run `./start.sh` from the `/api/` folder to install dependencies and start the server on port 9000.

# Notes to the Dynamic Team

## Issues and Their Solutions

### Account Abstraction

AA paymaster wasn't working until I found a suggestion from Derek in ZeroDev's forum about trying different providers. Apparently only Pimlico works for gas sponsorship on Amoy.

- May be worth changing the AA guide to reflect this or use a different chain where things "just work."

[Verified NFT contract on Polygon Amoy](https://amoy.polygonscan.com/address/0xBaee5E20983614F8e5Ca0f529896aEC38E6e3ed4#code)

### Cookie-based Authentication

Unfortunately I wasn't able to get cookie-based auth functional in this demo, even after going through the steps to register and validate a domain.

- I can't enable cookies in Dynamic dashboard until domain is configured, even though I'm on Sandbox.
- I can't validate domain, even after configuring TXT and CNAME.
- The domain was validated on the Dynamic dashboard momentarily, but the dashboard seems to "forget" and start the validation process over (with _new_ TXT and CNAME values) when I switch to the cookie tab.

Related, the "production environment" at https://dynamic-auth.xyz can't get past the login step due to some SSL and other settings errors. The intention was always to create a local-only demo environment; the hosted site only exists as a byproduct of trying to enable cookies.

### Server-side JWT Verification

This went quite smoothly. I decided to mock a PHP server for the customer's sake.

I appreciate that the [API references](https://docs.dynamic.xyz/authentication-methods/how-to-validate-users-on-the-backend) include PHP examples!
