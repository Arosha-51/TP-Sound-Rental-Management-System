# Test Report - Sprint 1 (Ongoing)

**Project:** TP Sound Rental Management System
**Client:** T.P. Sound & Musical Gear Rentals
**Tester:** S.D.K.K. Saputhanthri (Student 02 - Reg No: 324703649)
**Sprint:** TPS Sprint 1
**Report Date:** 2026-10-05
**Status:** Ongoing (Sprint ends 15 Oct 2026)

---

## 1. Test Environment

| Item | Details |
|------|---------|
| Backend | Node.js + Express.js (Port 5000) |
| Frontend | React + Vite (Port 5173) |
| Database | MongoDB Atlas (test database) |
| Testing Tool | Postman |
| Browser | Google Chrome |

---

## 2. Test Cases Executed

### 2.1 Summary Table

| Test ID | Test Case | Endpoint | Method | Expected | Actual | Status |
|---------|-----------|----------|--------|----------|--------|--------|
| TC-01 | Get all equipment | /api/equipment | GET | 200 OK | 200 OK | Pass |
| TC-02 | Create new equipment | /api/equipment | POST | 201 Created | 201 Created | Pass |
| TC-03 | Create new booking | /api/bookings | POST | 201 Created | 201 Created | Pass |
| TC-04 | Double-booking prevention | /api/bookings | POST | 400 Bad Request | 400 Bad Request | Pass |
| TC-05 | Invalid Equipment ID | /api/bookings | POST | 400 Bad Request | 400 Bad Request | Pass |
| TC-06 | Missing Start Date | /api/bookings | POST | 400 Bad Request | 400 Bad Request | Pass |
| TC-07 | End date before Start date | /api/bookings | POST | 400 Bad Request | 400 Bad Request | Pass |
| TC-08 | Update booking status (Approve) | /api/bookings/:id/status | PUT | 200 OK | 200 OK | Pass |
| TC-09 | Get all bookings | /api/bookings | GET | 200 OK | 200 OK | Pass |
| TC-10 | Invalid Customer ID format | /api/bookings | POST | 400 Bad Request | 400 Bad Request | Pass |
| TC-11 | Missing Equipment ID | /api/bookings | POST | 400 Bad Request | 400 Bad Request | Pass |
| TC-12 | Invalid Booking ID (PUT) | /api/bookings/:id/status | PUT | 400 Bad Request | 400 Bad Request | Pass |
| TC-13 | Invalid Status value (PUT) | /api/bookings/:id/status | PUT | 400 Bad Request | 400 Bad Request | Pass |

**Total Tests:** 13 | **Passed:** 13 | **Failed:** 0

---

## 3. Detailed Test Cases

### TC-01: Get All Equipment

- **Endpoint:** `GET /api/equipment`
- **Purpose:** Verify system returns all equipment in the catalog
- **Test Data:** None
- **Expected Result:** `200 OK` + array of equipment
- **Actual Result:** `200 OK` + 8 equipment items with equipmentCode (EQ-001 to EQ-008)
- **Status:** Pass
- **Screenshot:** `TC-01_GET_Equipment.png`

---

### TC-02: Create New Equipment

- **Endpoint:** `POST /api/equipment`
- **Purpose:** Verify new equipment can be added and equipmentCode auto-generates
- **Test Data:**

```json
{
  "name": "Test Guitar",
  "category": "Guitars & Basses",
  "dailyRate": 3000
}
```

- **Expected Result:** `201 Created` + equipmentCode auto-generated
- **Actual Result:** `201 Created` + equipmentCode = "EQ-009"
- **Status:** Pass
- **Screenshot:** `TC-02_POST_Equipment.png`

---

### TC-03: Create New Booking

- **Endpoint:** `POST /api/bookings`
- **Purpose:** Verify booking can be created with unique ID and total fee calculation
- **Test Data:**

```json
{
  "customerId": "653f8a1b2c3d4e5f6a7b8c9d",
  "equipmentId": "6ac10784454b837fbad14946",
  "startDate": "2026-11-01",
  "endDate": "2026-11-03"
}
```

- **Expected Result:** `201 Created` + unique bookingId + totalFee calculated
- **Actual Result:** `201 Created` + bookingId = "#TP-2026-003" + totalFee = 18500
- **Status:** Pass
- **Screenshot:** `TC-03_POST_Booking.png`

---

### TC-04: Double-Booking Prevention

- **Endpoint:** `POST /api/bookings`
- **Purpose:** Verify system blocks duplicate booking for same equipment/dates
- **Test Data:** Same as TC-03 (duplicate request)
- **Expected Result:** `400 Bad Request` + "Equipment is already booked for these dates!"
- **Actual Result:** `400 Bad Request` + error message with conflict booking ID
- **Status:** Pass
- **Screenshot:** `TC-04_Double_Booking.png`

---

### TC-05: Invalid Equipment ID Format

- **Endpoint:** `POST /api/bookings`
- **Purpose:** Verify system rejects invalid ObjectId format
- **Test Data:**

```json
{
  "customerId": "653f8a1b2c3d4e5f6a7b8c9d",
  "equipmentId": "1234567890",
  "startDate": "2026-11-05",
  "endDate": "2026-11-07"
}
```

- **Expected Result:** `400 Bad Request` + "Invalid Equipment ID format"
- **Actual Result:** `400 Bad Request` + "Invalid Equipment ID format"
- **Status:** Pass
- **Screenshot:** `TC-05_Invalid_ID.png`

---

### TC-06: Missing Start Date

- **Endpoint:** `POST /api/bookings`
- **Purpose:** Verify validation for missing required fields
- **Test Data:**

```json
{
  "customerId": "653f8a1b2c3d4e5f6a7b8c9d",
  "equipmentId": "6ac10784454b837fbad14946",
  "endDate": "2026-11-07"
}
```

- **Expected Result:** `400 Bad Request` + "Start date and End date are required"
- **Actual Result:** `400 Bad Request` + error message
- **Status:** Pass
- **Screenshot:** `TC-06_Missing_Date.png`

---

### TC-07: End Date Before Start Date

- **Endpoint:** `POST /api/bookings`
- **Purpose:** Verify system prevents negative total fee
- **Test Data:**

```json
{
  "customerId": "653f8a1b2c3d4e5f6a7b8c9d",
  "equipmentId": "6ac10784454b837fbad14946",
  "startDate": "2026-11-10",
  "endDate": "2026-11-05"
}
```

- **Expected Result:** `400 Bad Request` + "End date must be after Start date"
- **Actual Result:** `400 Bad Request` + error message
- **Status:** Pass
- **Screenshot:** `TC-07_EndBeforeStart.png`

---

### TC-08: Update Booking Status (Approve)

- **Endpoint:** `PUT /api/bookings/:id/status`
- **Purpose:** Verify proprietor can approve a pending booking request
- **Test Data:**

```json
{
  "status": "Approved"
}
```

- **Expected Result:** `200 OK` + booking.status = "Approved"
- **Actual Result:** `200 OK` + status updated to "Approved"
- **Status:** Pass
- **Screenshot:** `TC-08_PUT_Status_Success.png`

---

### TC-09: Get All Bookings

- **Endpoint:** `GET /api/bookings`
- **Purpose:** Verify system returns all bookings with populated customer and equipment details
- **Test Data:** None
- **Expected Result:** `200 OK` + array of bookings
- **Actual Result:** `200 OK` + booking list with populated equipmentId
- **Status:** Pass
- **Screenshot:** `TC-09_GET_Bookings_Success.png`

---

### TC-10: Invalid Customer ID Format

- **Endpoint:** `POST /api/bookings`
- **Purpose:** Verify system rejects invalid Customer ObjectId format
- **Test Data:**

```json
{
  "customerId": "abc",
  "equipmentId": "6ac10784454b837fbad14946",
  "startDate": "2026-11-05",
  "endDate": "2026-11-07"
}
```

- **Expected Result:** `400 Bad Request` + "Invalid Customer ID format"
- **Actual Result:** `400 Bad Request` + error message
- **Status:** Pass
- **Screenshot:** `TC-10_Invalid_CustomerID.png`

---

### TC-11: Missing Equipment ID

- **Endpoint:** `POST /api/bookings`
- **Purpose:** Verify system requires Equipment ID
- **Test Data:**

```json
{
  "customerId": "653f8a1b2c3d4e5f6a7b8c9d",
  "startDate": "2026-11-05",
  "endDate": "2026-11-07"
}
```

- **Expected Result:** `400 Bad Request` + "Customer ID and Equipment ID are required"
- **Actual Result:** `400 Bad Request` + error message
- **Status:** Pass
- **Screenshot:** `TC-11_Missing_EquipmentID.png`

---

### TC-12: Invalid Booking ID Format (PUT)

- **Endpoint:** `PUT /api/bookings/:id/status`
- **Purpose:** Verify system rejects invalid Booking ID format
- **Test Data:** URL: `/api/bookings/12345/status`

```json
{
  "status": "Approved"
}
```

- **Expected Result:** `400 Bad Request` + "Invalid Booking ID format"
- **Actual Result:** `400 Bad Request` + error message
- **Status:** Pass
- **Screenshot:** `TC-12_Invalid_BookingID.png`

---

### TC-13: Invalid Status Value (PUT)

- **Endpoint:** `PUT /api/bookings/:id/status`
- **Purpose:** Verify system rejects invalid status values
- **Test Data:**

```json
{
  "status": "WrongStatus"
}
```

- **Expected Result:** `400 Bad Request` + "Invalid status value"
- **Actual Result:** `400 Bad Request` + error message
- **Status:** Pass
- **Screenshot:** `TC-13_Invalid_Status.png`

---

## 4. Bugs Found & Fixed

| Bug ID | Description | Severity | Status | Fixed By |
|--------|-------------|----------|--------|----------|
| BUG-01 | Negative total fee when end date is before start date | High | Fixed | B.G.N.H Bokanda |
| BUG-02 | 500 error on GET /api/bookings (User model not imported) | High | Fixed | B.G.N.H Bokanda |
| BUG-03 | Double-booking allowed for Pending bookings | High | Fixed | B.G.N.H Bokanda |
| BUG-04 | Invalid ObjectId causes raw MongoDB error | Medium | Fixed | B.G.N.H Bokanda |

---

## 5. Pending Tests (To be done before Sprint 1 ends)

| Test ID | Test Case | Status |
|---------|-----------|--------|
| TC-14 | User Registration API | Pending |
| TC-15 | User Login API | Pending |
| TC-16 | Frontend UI Testing (Catalog) | Pending |
| TC-17 | Frontend UI Testing (Booking Form) | Pending |
| TC-18 | Frontend UI Testing (Dashboard) | Pending |
| TC-19 | Cross-Browser Testing | Pending |

---

**Prepared By:** S.D.K.K. Saputhanthri (Student 02)
**Reviewed By:** P.A.Y. Ekanayake (Student 01)