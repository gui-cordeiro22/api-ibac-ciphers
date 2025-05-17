// Dependencies
import express from "express";

export const convertToJson = (app: any) => {
  app.use(express.json());
};
