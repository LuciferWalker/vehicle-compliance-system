import { NextRequest } from "next/server";

// Attaching a custom property, user to NextRequest object
declare module "next/server" {
  export interface NextRequest {
    user?: {
      id: string;
      role: string;
    };
  }
}
