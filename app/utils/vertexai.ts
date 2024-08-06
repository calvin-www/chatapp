import { VertexAI } from "@google-cloud/vertexai";

const project = 'chatapp-e3666';
const location = 'us-central1';

const vertexAI = new VertexAI({project: project, location: location});

const model = 'gemini-1.5-pro'; // Use the same model as in your other file

export { vertexAI, model };