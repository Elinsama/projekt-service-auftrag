import { Admin, MongoClient, ObjectId } from 'mongodb';

const uri = "mongodb://127.0.0.1:27017/"
const a = "assignments"

export async function connectToDB(uri, collectionName) {
    let mongoClient;

    try {
        mongoClient = new MongoClient(uri);
        console.log('Connecting...');
        await mongoClient.connect();

        const db = mongoClient.db('services');
        const collection = db.collection(collectionName);

        const rootuser = await db.collection('users').findOne({ Name: "root" })
        if (!rootuser) {
            await db.collection('users').insertOne({ Name: "root", Vorname: "root", password: "1", role: ["admin"]})
        }

        return collection;
    } catch (error) {
        console.error('Connection to MongoDB failed!', error);
    }
}

export async function createAssignment(assignment) {
    const collection = await connectToDB(uri, a);
    await collection.insertOne(assignment);
}

export async function searching(search) {
    const collection = await connectToDB(uri, a);
    return await collection.find(search && search.name ? search : undefined).toArray();
}

export async function getById(id) {
    const collection = await connectToDB(uri, a);
    return await collection.findOne(ObjectId(id));
}

export async function createUser(user) {
    const collection = await connectToDB(uri, 'users');
    await collection.insertOne(user);
}

export async function finduser(user) {
    const collection = await connectToDB(uri, 'users');
    return await collection.findOne(user);
}

export async function deleteAssignments(ids) {
    const collection = await connectToDB(uri, a);
    await collection.deleteMany({ _id: { $in: ids.map((id) => ObjectId(id)) } });
}

export async function updateAssignment(assignment) {
    const collection = await connectToDB(uri, a);
    await collection.replaceOne({ _id: ObjectId(assignment.id) }, assignment);
}

export async function searchUser(search) {
    const collection = await connectToDB(uri, 'users');
    return await collection.find(search && search.Name ? search : undefined).toArray();
}

export async function deleteUsers(ids) {
    const collection = await connectToDB(uri, 'users');
    await collection.deleteMany({ _id: { $in: ids.map((id) => ObjectId(id)) } });
}