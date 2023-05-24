#### Collections and Documents

- **`collection(firestore, path, pathSegments)`**:
  - Description: Gets a CollectionReference instance that refers to the collection at the specified absolute path.
  - Usage example:
    ```javascript
    const collectionRef = collection(firestore, 'myCollection');
    ```

- **`collectionGroup(firestore, collectionId)`**:
  - Description: Creates and returns a new Query instance that includes all documents in the database that are contained in a collection or subcollection with the given collectionId.
  - Usage example:
    ```javascript
    const query = collectionGroup(firestore, 'myCollection');
    ```

- **`doc(firestore, path, pathSegments)`**:
  - Description: Gets a DocumentReference instance that refers to the document at the specified absolute path.
  - Usage example:
    ```javascript
    const docRef = doc(firestore, 'myCollection/myDocument');
    ```

#### Uploading and Retrieving Data

- **`addDoc(collectionRef, data)`**:
  - Description: Adds a new document to the specified collection with the provided data. The document ID is automatically generated.
  - Usage example:
    ```javascript
    const newDocRef = await addDoc(collectionRef, { key: 'value' });
    ```

- **`setDoc(documentRef, data, options)`**:
  - Description: Overwrites the document referred to by the provided DocumentReference. If the document does not exist, it will be created. If it exists, it will be replaced with the new data.
  - Usage example:
    ```javascript
    await setDoc(documentRef, { key: 'value' });
    ```

- **`updateDoc(documentRef, data)`**:
  - Description: Updates fields in the document referred to by the provided DocumentReference. If the document does not exist, the update will fail.
  - Usage example:
    ```javascript
    await updateDoc(documentRef, { key: 'new value' });
    ```

- **`getDoc(documentRef)`**:
  - Description: Retrieves the current document snapshot from the provided DocumentReference.
  - Usage example:
    ```javascript
    const documentSnapshot = await getDoc(documentRef);
    ```

- **`getDocs(query)`**:
  - Description: Retrieves multiple document snapshots from the provided query or collection reference.
  - Usage example:
    ```javascript
    const querySnapshot = await getDocs(query);
    ```

#### Querying Data

- **`query(collectionRef, ...queryConstraints)`**:
  - Description: Creates and returns a new Query instance that applies the specified query constraints to the collection reference.
  - Usage example:
    ```javascript
    const query = query(collectionRef, where('key', '==', 'value'), orderBy('timestamp'));
    ```

- **`where(fieldPath, opStr, value)`**:
  - Description: Creates a new QueryConstraint that filters documents based on the provided field path, comparison operator, and value.
  - Usage example:
    ```javascript
    const query = where('age', '>', 18);
    ```

- **`orderBy(fieldPath, directionStr)`**:
  - Description: Creates a new QueryConstraint that orders the query results by the specified field path and direction.
  - Usage example:
    ```javascript
    const query = orderBy('name', 'asc');
    ```

These functions provide the necessary functionality to work with collections, documents, and perform CRUD (Create, Read, Update, Delete) operations in Firebase Firestore
