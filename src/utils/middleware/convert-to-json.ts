// Dependencies
import express from "express";

export const convertToJson = (app) => {
  app.use(express.json());
};
