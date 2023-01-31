import { MongoClient } from 'mongodb';

const uri = "mongodb://127.0.0.1:27017/"

export async function connectToCluster(uri) {
    let mongoClient;

    try {
        mongoClient = new MongoClient(uri);
        console.log('Connecting to MongoDB Atlas cluster...');
        await mongoClient.connect();
        console.log('Successfully connected to MongoDB Atlas!');

        const db = mongoClient.db('services');
        const collection = db.collection('assignments');

        return collection;
    } catch (error) {
        console.error('Connection to MongoDB Atlas failed!', error);
    }
}


export async function createAssignment(assignment) {
    let collection;
    collection = await connectToCluster(uri);
    await collection.insertOne(assignment);
}

export async function findassignmentbyname(collection, name) {
    return collection.find(name).toArray();
}

export async function searching(name) {
    let collection;
    collection = await connectToCluster(uri);
    return await findassignmentbyname(collection, name);

}


// const result = await searching({name: "Torben"})
// console.log(result)