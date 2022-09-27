import { ROSE_BASE_URL } from "../globals";
import axios from "axios";

export const dropPetal = (num: number): Promise<string> => {
  const url = `${ROSE_BASE_URL}/activate/${num}`;

  return new Promise<string>((resolve, reject) => {
    axios
      .get(url)
      .then((result) => {
        resolve(`Dropped ${num} GOT IT!`);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const testConnectivity = (): Promise<any> => {
  const url = `${ROSE_BASE_URL}/status`;

  return new Promise<any>((resolve, reject) => {
    axios
      .get(url)
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const changeColor = (r: number, g: number, b: number): Promise<any> => {
  const url = `${ROSE_BASE_URL}/color?r=${r}&g=${g}&b=${b}`;

  return new Promise<any>((resolve, reject) => {
    axios
      .get(url)
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
