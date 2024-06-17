# E-at Application (Online delivery)

## Overview
This project builds the backend of an online delivery application that allows users to view items and submit orders. The application simulates an online delivery shop with a menu organized into 3 categories, each containing 3 items (as seeded). The prices of items are stored in Euro, and the API supports currency conversion using a publicly available API like [Free Currency API](https://www.freecurrencyapi.com/). The app supports login system throw node.js passport.

The application allows:
- Users to browse the menu, add items to cart and submit orders.
- Merchants (admins) to view incoming orders through a simple web interface.
- Authentication using predefined credentials (`test` / `12345678` for role `user`, `admin` / `admin` for role `merchant`).

## Development Stack
- Node.js - Express-node.js
- MongoDB with Mongoose ORM


## Prerequisites
Before you begin, make sure you have the following installed:
- Node.js (v22.3.0 or later)
- MongoDB Community Server
- MongoDB Compass (optional but recommended)

## Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/Tsikriteas/Eat_node_mongo.git

## url
http://localhost:
PORT=3000
MONGODB_URI=mongodb://localhost:27017/db-name

## API Endpoints
Authentication
POST /api/auth/login:

Menu
GET /categories/: Get all categories
POST /categories/: Create a new menu category.
GET /categories/:id: Delete a category

GET /items/: Get all items
POST /category/:categoryId: Get items per category
POST /items/: Create items
POST /items/:id: Delete items

Orders
GET /orders/: Get all orders.
POST /orders/: Place a new order.

User connection APIS available throw Postman

## Project Structure
The project follows this directory structure:


