# Documentation API Nextmit

## Base URL
`https://api.nextmit.com/v1`

## Authentification
Tous les endpoints protégés nécessitent un token Bearer dans le header :
```
Authorization: Bearer <token>
```

## Endpoints

### Authentification

#### Login
- **POST** `/auth/login`
- **Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response** (200):
  ```json
  {
    "user": {
      "id": "string",
      "firstName": "string",
      "lastName": "string",
      "email": "string",
      "phone": "string",
      "profileImage": "string?"
    },
    "token": "string"
  }
  ```

#### Register
- **POST** `/auth/register`
- **Body**:
  ```json
  {
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "phone": "string",
    "password": "string"
  }
  ```
- **Response** (201):
  ```json
  {
    "message": "Vérifiez votre email pour le code de confirmation"
  }
  ```

#### Verify Code
- **POST** `/auth/verify`
- **Body**:
  ```json
  {
    "email": "string",
    "code": "string"
  }
  ```
- **Response** (200):
  ```json
  {
    "verified": true
  }
  ```

#### Reset Password
- **POST** `/auth/reset-password`
- **Body**:
  ```json
  {
    "email": "string",
    "code": "string",
    "newPassword": "string"
  }
  ```
- **Response** (200):
  ```json
  {
    "message": "Mot de passe réinitialisé avec succès"
  }
  ```

### Utilisateurs

#### Get User Profile
- **GET** `/users/{userId}`
- **Auth**: Required
- **Response** (200):
  ```json
  {
    "id": "string",
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "phone": "string",
    "profileImage": "string?"
  }
  ```

#### Update User Profile
- **PUT** `/users/{userId}`
- **Auth**: Required
- **Body**:
  ```json
  {
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "phone": "string"
  }
  ```
- **Response** (200): Updated user object

#### Upload Profile Image
- **POST** `/users/{userId}/profile-image`
- **Auth**: Required
- **Content-Type**: multipart/form-data
- **Body**:
  - `image`: File (max 5MB, formats: jpg, png)
- **Response** (200):
  ```json
  {
    "imageUrl": "string"
  }
  ```

#### Delete Profile Image
- **DELETE** `/users/{userId}/profile-image`
- **Auth**: Required
- **Response** (200):
  ```json
  {
    "message": "Image supprimée avec succès"
  }
  ```

### Événements

#### List Events
- **GET** `/events`
- **Query Parameters**:
  - `page`: number
  - `limit`: number
  - `search`: string?
  - `category`: string?
- **Response** (200):
  ```json
  {
    "events": [
      {
        "id": "string",
        "title": "string",
        "description": "string",
        "date": "string",
        "location": "string",
        "image": "string",
        "price": number
      }
    ],
    "total": number,
    "page": number,
    "limit": number
  }
  ```

#### Get Event Details
- **GET** `/events/{eventId}`
- **Response** (200): Detailed event object

#### Get Event Tickets
- **GET** `/events/{eventId}/tickets`
- **Auth**: Required
- **Response** (200): List of available tickets

### Portefeuille

#### Get Wallet Balance
- **GET** `/wallet`
- **Auth**: Required
- **Response** (200):
  ```json
  {
    "balance": number,
    "currency": "string"
  }
  ```

#### List Transactions
- **GET** `/wallet/transactions`
- **Auth**: Required
- **Query Parameters**:
  - `page`: number
  - `limit`: number
- **Response** (200): List of transactions

#### Get Transaction Details
- **GET** `/wallet/transactions/{transactionId}`
- **Auth**: Required
- **Response** (200): Detailed transaction object

## Codes d'erreur

- 400: Bad Request - Requête invalide
- 401: Unauthorized - Token manquant ou invalide
- 403: Forbidden - Permissions insuffisantes
- 404: Not Found - Ressource non trouvée
- 500: Server Error - Erreur interne du serveur

## Limites et Restrictions

### Images
- Taille maximale: 5MB
- Formats acceptés: jpg, png
- Dimensions maximales: 1024x1024
- Compression: 85% de qualité

### Cache
- Durée de vie: 7 jours
- Taille maximale: 100MB

### Uploads
- Tentatives maximales: 3
- Timeout: 5 minutes
- Uploads simultanés: 3 maximum 