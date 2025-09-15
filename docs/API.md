# BBkits Materials Management API Documentation

## Overview

The BBkits API provides comprehensive access to materials management functionality including materials, suppliers, and inventory management. The API is RESTful and returns JSON responses.

## Base URL

```
https://your-domain.com/api/v1
```

## Authentication

The API supports two authentication methods:

### 1. Bearer Token (Sanctum)
```bash
Authorization: Bearer your-token-here
```

### 2. API Key
```bash
X-API-Key: bbkits_your_api_key_here
```

## Rate Limiting

Different endpoints have different rate limits:

- **Standard endpoints**: 100 requests per minute
- **Integration endpoints**: 1000 requests per minute
- **Bulk operations**: 10 requests per minute
- **Webhook endpoints**: 5000 requests per minute

Rate limits are increased for authenticated users based on their role:
- Admin: 5x standard limit
- Manager: 3x standard limit
- Production Admin: 2x standard limit

## Response Format

All API responses follow this format:

```json
{
    "success": true|false,
    "message": "Human readable message",
    "data": {},
    "meta": {
        "api_version": "1.0.0",
        "timestamp": "2023-XX-XXTXX:XX:XX.XXXZ"
    }
}
```

### Pagination

Paginated responses include additional meta information:

```json
{
    "success": true,
    "data": [...],
    "meta": {
        "current_page": 1,
        "last_page": 5,
        "per_page": 15,
        "total": 75,
        "from": 1,
        "to": 15
    },
    "links": {
        "first": "https://domain.com/api/v1/materials?page=1",
        "last": "https://domain.com/api/v1/materials?page=5",
        "prev": null,
        "next": "https://domain.com/api/v1/materials?page=2"
    }
}
```

## Error Handling

Error responses include appropriate HTTP status codes and descriptive messages:

```json
{
    "success": false,
    "message": "Validation failed",
    "error": "validation_error",
    "errors": {
        "name": ["The name field is required."]
    }
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `429` - Too Many Requests
- `500` - Server Error

## Materials API

### List Materials

```http
GET /api/v1/materials
```

**Query Parameters:**
- `search` - Search in name, reference, or description
- `status` - Filter by stock status (`active`, `low_stock`, `out_of_stock`)
- `supplier_id` - Filter by supplier ID
- `per_page` - Results per page (max 100, default 15)
- `page` - Page number

**Example:**
```bash
curl -H "Authorization: Bearer token" \
  "https://domain.com/api/v1/materials?search=cotton&status=low_stock&per_page=25"
```

### Get Material

```http
GET /api/v1/materials/{id}
```

### Create Material

```http
POST /api/v1/materials
```

**Request Body:**
```json
{
    "external_id": "ERP123456",
    "name": "Cotton Fabric Blue",
    "reference": "COT-BLU-001",
    "description": "High quality cotton fabric in blue",
    "unit": "meters",
    "current_stock": 100.500,
    "minimum_stock": 10.000,
    "purchase_price": 25.99,
    "supplier_id": 1
}
```

### Update Material

```http
PUT /api/v1/materials/{id}
```

### Delete Material

```http
DELETE /api/v1/materials/{id}
```

### Adjust Stock

```http
POST /api/v1/materials/{id}/adjust-stock
```

**Request Body:**
```json
{
    "quantity": 50.000,
    "type": "purchase",
    "notes": "New shipment received",
    "reference": "PO-2023-001"
}
```

**Stock Types:**
- `purchase` - Stock increase from purchase
- `consumption` - Stock decrease from usage
- `adjustment` - Manual stock adjustment
- `return` - Stock increase from returns

### Materials Statistics

```http
GET /api/v1/materials/stats
```

## Suppliers API

### List Suppliers

```http
GET /api/v1/suppliers
```

**Query Parameters:**
- `search` - Search in name, email, phone, or contact person
- `has_materials` - Filter suppliers with/without materials (true/false)
- `per_page` - Results per page
- `page` - Page number

### Get Supplier

```http
GET /api/v1/suppliers/{id}
```

### Get Supplier Materials

```http
GET /api/v1/suppliers/{id}/materials
```

### Create Supplier

```http
POST /api/v1/suppliers
```

**Request Body:**
```json
{
    "external_id": "SUP123",
    "name": "Textile Suppliers Inc",
    "email": "contact@textiles.com",
    "phone": "+1234567890",
    "address": "123 Industrial Ave, City, State",
    "contact_person": "John Smith",
    "notes": "Reliable cotton supplier"
}
```

### Update Supplier

```http
PUT /api/v1/suppliers/{id}
```

### Delete Supplier

```http
DELETE /api/v1/suppliers/{id}
```

## Inventory API

### List Inventory Transactions

```http
GET /api/v1/inventory
```

**Query Parameters:**
- `search` - Search in notes, reference, or material name
- `type` - Filter by transaction type
- `material_id` - Filter by material ID
- `user_id` - Filter by user ID
- `date_from` - Filter from date (YYYY-MM-DD)
- `date_to` - Filter to date (YYYY-MM-DD)
- `per_page` - Results per page
- `page` - Page number

### Get Transaction

```http
GET /api/v1/inventory/{id}
```

### Create Transaction

```http
POST /api/v1/inventory
```

**Request Body:**
```json
{
    "material_id": 1,
    "quantity": -10.500,
    "type": "consumption",
    "notes": "Used for order #12345",
    "reference": "ORDER-12345"
}
```

### Bulk Adjustment

```http
POST /api/v1/inventory/bulk-adjustment
```

**Request Body:**
```json
{
    "notes": "Monthly inventory adjustment",
    "reference": "ADJ-2023-12",
    "adjustments": [
        {
            "material_id": 1,
            "quantity": 5.000,
            "notes": "Found extra stock"
        },
        {
            "material_id": 2,
            "quantity": -2.500,
            "notes": "Damaged goods"
        }
    ]
}
```

### Inventory Statistics

```http
GET /api/v1/inventory/stats
```

## Integration Endpoints

For external ERP systems and integrations.

### Sync Materials

```http
POST /api/v1/integration/sync/materials
```

**Request Body:**
```json
{
    "materials": [
        {
            "external_id": "ERP001",
            "name": "Material 1",
            "reference": "REF001",
            "unit": "pieces",
            "current_stock": 100,
            "minimum_stock": 10,
            "purchase_price": 15.50,
            "supplier_external_id": "SUP001"
        }
    ]
}
```

### Sync Suppliers

```http
POST /api/v1/integration/sync/suppliers
```

### Get Stock Levels

```http
GET /api/v1/integration/stock-levels?external_ids=ERP001,ERP002&low_stock_only=true
```

### Process Stock Movements

```http
POST /api/v1/integration/stock-movements
```

**Request Body:**
```json
{
    "movements": [
        {
            "material_external_id": "ERP001",
            "quantity": 50,
            "type": "purchase",
            "reference": "PO-2023-001",
            "timestamp": "2023-12-01T10:00:00Z"
        }
    ]
}
```

### Stock Update Webhook

```http
POST /api/v1/integration/webhook/stock-update
```

**Request Body:**
```json
{
    "external_id": "ERP001",
    "current_stock": 75.500,
    "timestamp": "2023-12-01T10:00:00Z"
}
```

## Health Check

```http
GET /api/health
```

Returns system health status (no authentication required).

## Legacy Endpoints

Backward compatibility endpoints available at `/api/legacy/*`.

## SDKs and Examples

### cURL Examples

**List materials:**
```bash
curl -H "Authorization: Bearer your-token" \
  -H "Accept: application/json" \
  "https://domain.com/api/v1/materials"
```

**Create material:**
```bash
curl -X POST \
  -H "Authorization: Bearer your-token" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"name":"Test Material","reference":"TEST-001","unit":"pieces","current_stock":10,"minimum_stock":5,"purchase_price":15.99}' \
  "https://domain.com/api/v1/materials"
```

### JavaScript Example

```javascript
const API_BASE = 'https://domain.com/api/v1';
const API_TOKEN = 'your-token-here';

const headers = {
    'Authorization': `Bearer ${API_TOKEN}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
};

// Get materials
const materials = await fetch(`${API_BASE}/materials`, { headers })
    .then(response => response.json());

// Create material
const newMaterial = await fetch(`${API_BASE}/materials`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
        name: 'New Material',
        reference: 'NEW-001',
        unit: 'pieces',
        current_stock: 100,
        minimum_stock: 10,
        purchase_price: 25.99
    })
}).then(response => response.json());
```

### Python Example

```python
import requests

API_BASE = 'https://domain.com/api/v1'
API_TOKEN = 'your-token-here'

headers = {
    'Authorization': f'Bearer {API_TOKEN}',
    'Content-Type': 'application/json',
    'Accept': 'application/json'
}

# Get materials
response = requests.get(f'{API_BASE}/materials', headers=headers)
materials = response.json()

# Create material
material_data = {
    'name': 'New Material',
    'reference': 'NEW-001',
    'unit': 'pieces',
    'current_stock': 100,
    'minimum_stock': 10,
    'purchase_price': 25.99
}

response = requests.post(f'{API_BASE}/materials',
                        headers=headers,
                        json=material_data)
new_material = response.json()
```

## Support

For API support and questions, contact: api-support@bbkits.com