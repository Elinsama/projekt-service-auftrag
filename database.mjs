import { MongoClient } from 'mongodb';

const uri = "mongodb://127.0.0.1:27017/"

export async function connectToCluster(uri) {
    let mongoClient;

    try {
        mongoClient = new MongoClient(uri);
        console.log('Connecting to MongoDB Atlas cluster...');
        await mongoClient.connect();
        console.log('Successfully connected to MongoDB Atlas!');

        return mongoClient;
    } catch (error) {
        console.error('Connection to MongoDB Atlas failed!', error);
    }
}


export async function createAssignment(assignment) {
    let mongoClient;

    try {
        mongoClient = await connectToCluster(uri);
        const db = mongoClient.db('services');
        const collection = db.collection('assignments');

        await collection.insertOne(assignment);
    } catch (error) {
        console.error('Connection to MongoDB Atlas failed!', error);
    } finally {
        await mongoClient.close();
    }
}
