import express from 'express';


const authorRoutes = express.Router();

authorRoutes.post("/AuthorSignup", authorSignup)