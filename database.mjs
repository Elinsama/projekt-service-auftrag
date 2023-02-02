import { MongoClient } from 'mongodb';

const uri = "mongodb://127.0.0.1:27017/"

export async function connectToDB(uri, collectionName) {
    let mongoClient;

    try {
        mongoClient = new MongoClient(uri);
        console.log('Connecting...');
        await mongoClient.connect();

        const db = mongoClient.db('services');
        const collection = db.collection(collectionName);

        return collection;
    } catch (error) {
        console.error('Connection to MongoDB failed!', error);
    }
}

export async function createAssignment(assignment) {
    const collection = await connectToDB(uri, 'assignments');
    await collection.insertOne(assignment);
}

export async function searching(search) {
    const collection = await connectToDB(uri, 'assignments');
    return await collection.find(search&&search.name ? search : undefined).toArray();
}

export async function createUser(user) {
    const collection = await connectToDB(uri, 'users');
    await collection.insertOne(user);
}

export async function finduser(user) {
    const collection = await connectToDB(uri, 'users');
    return await collection.findOne(user);
}