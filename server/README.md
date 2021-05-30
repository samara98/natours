# API

Endpoints

<details>
<summary>api v1</summary>

- users
  - [`GET` Me](#me)
- tours
  - [`GET` Get Top 5 Cheap](#get-top-5-cheap)
  - [`GET` Get Tour Stats](#get-tour-stats)
  - [`GET` Get Monthly Plan](#get-monthly-plan)
  - [`GET` Get Tours Within](#get-tours-within)
  - [`GET` Get Distances](#get-distances)
  - [`GET` Get All Tours](#get-all-tours)
  - [`POST` Create Tour](#create-tour)
  - [`GET` Get Tour](#get-tour)
  - [`PATCH` Update Tour](#get-tour)
  - [`DELETE` Delete Tour](#get-tour)

</details>

## Template

<_Additional information about your API call. Try to use verbs that match both request type (fetching vs modifying) and plurality (one vs multiple)._>

<details>

- **Method**

  <_The request type_>

  `GET` | `POST` | `DELETE` | `PUT`

- **URL**

  <_The URL Structure (path only, no root url)_>

- **Query Params**

  <_If URL params exist, specify them in accordance with name mentioned in URL section. Separate into optional and required. Document data constraints._>

  **Required:**

  `id=[integer]`

  **Optional:**

  `photo_id=[alphanumeric]`

- **Data Params**

  <_If making a post request, what should the body payload look like? URL Params rules apply here too._>

- **Success Response**

  <_What should the status code be on success and is there any returned data? This is useful when people need to to know what their callbacks should expect!_>

  - **Code**`200`

  - **Content**

  ```json
  {
    "id": 12
  }
  ```

- **Error Response:**

  <_Most endpoints will have many ways they can fail. From unauthorized access, to wrongful parameters etc. All of those should be liste d here. It might seem repetitive, but it helps prevent assumptions from being made where they should be._>

  - **Code** `401`

  OR

  - **Code** `422`

- **Sample Call**

  <_Just a sample call to your endpoint in a runnable format ($.ajax call or a curl request) - this makes life easier and more predictable._>

- **Notes**

  <_This is where all uncertainties, commentary, discussion etc. can go. I recommend timestamping and identifying oneself when leaving comments here._>

</details>

---

## Error Response

<details>

```json
{
  "message": "string",
  "error": {},
  "meta": {
    "status": "number"
  }
}
```

</details>

---

## Me

<details>

- **Auth** `Yes`
- **Method** `GET`
- **URL** `/api/v1/users/me`
- **Query Params** `None`
- **Data Params** `None`
- **Success Response**
  - **Code** `200`
  - **Content**
    ```json
    {
      "data": {
        "user": {
          "id": "mongoId"
        }
      },
      "meta": {
        "status": 200
      }
    }
    ```

</details>

---

## Get Top 5 Cheap

<details>

</details>

---

## Get Tour Stats

<details>

</details>

---

## Get Monthly Plan

<details>

</details>

---

## Get Tours Within

<details>

</details>

---

## Get Distances

<details>

</details>

---

## Get All Tours

<details>

</details>

---

## Create Tour

<details>

</details>

---

## Get Tour

<details>

</details>

---

## Update Tour

<details>

</details>

---

## Delete Tour

<details>

</details>

---
