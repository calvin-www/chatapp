import { VertexAI } from "@google-cloud/vertexai";

const project = 'chatapp-e3666';
const location = 'us-central1';

const vertexAI = new VertexAI({project: project, location: location});

const generativeModel = vertexAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
  // Add any other configuration options here
});

export { generativeModel };