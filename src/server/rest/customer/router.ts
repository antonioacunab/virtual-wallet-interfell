import type { Router } from "express";

import express from "express";

import { createCustomer } from "./handler";

export const ROUTER: Router = express.Router();

ROUTER.post("/create", createCustomer);