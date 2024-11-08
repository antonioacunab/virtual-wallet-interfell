import type { Router } from "express";

import express from "express";

import { createCustomer } from "./handlers";

export const ROUTER: Router = express.Router();

ROUTER.post("/create", createCustomer);