<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

**Bucky's Eshop API** 🛒👕  



A robust e-commerce backend solution built with NestJS and GraphQL, designed specifically for clothing retailers. This API powers a complete online store platform with comprehensive features for product catalog management, order processing, customer accounts, and secure transactions. 

The system efficiently handles all core e-commerce operations while providing the flexibility of GraphQL for data retrieval and the reliability of REST for specific services.


### Key Features:
- **GraphQL API** 🌐 for flexible data queries
- **Stripe Integration** 💰 with webhook management
- **CRUD Operations** 🛠️ for Products and Users
- **User Authentication** 🔑 system using REST
- **Image Handling** 🖼️ with Cloudinary
- **Email Service** ✉️ via SendGrid

### Integrated Services:
- **Payments**: Stripe API
- **Image Storage**: Cloudinary
- **Email Service**: SendGrid

> 💡 **Note**: No local database setup required - already deployed in the cloud! ☁️

## GraphQL Documentation
Explore the GraphQL schema and queries in our [API Documentation](https://studio.apollographql.com/org/carlos-penas-team-3/graphs)

## Environment Variables Configuration

You must create a `.env` file with the following variables to run the project:

```env
# Database
DATABASE_URL=postgres://user:password@host:port/database_name

# Authentication
JWT_SECRET=your_jwt_secret_key_here
JWT_EXP=3600  # JWT expiration time in seconds (e.g., 1 hour)
JWT_EXP_REFRESH=86400  # Refresh token expiration (e.g., 24 hours)
ADMIN_PASSWORD=your_admin_password_here

# Third-party APIs
SENDGRID_API_KEY=your_sendgrid_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK=your_stripe_webhook_secret

# Cloud Storage (Cloudinary)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name

# Server Configuration
NODE_PORT=3000  # Port where the Node server will run
```


## Project setup
```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

