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

export const testConnectivity = (): Promise<string> => {
  const url = `${ROSE_BASE_URL}/`;

  return new Promise<string>((resolve, reject) => {
    axios
      .get(url)
      .then((result) => {
        resolve(`CONNECTION SUCCESSFUL`);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
