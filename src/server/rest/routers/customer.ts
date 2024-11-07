import type { Router } from "express";

import express from "express";

import { createCustomer } from "../handlers/customer";

export const CUSTOMERS_ROUTER: Router = express.Router();

CUSTOMERS_ROUTER.post("/create", createCustomer);