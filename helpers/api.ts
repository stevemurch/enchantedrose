import { ROSE_BASE_URL } from "../globals";
import axios from "axios";

export const dropPetal = (num: number): Promise<string> => {
  const url = `${ROSE_BASE_URL}/drop/${num}`;

  return new Promise<string>((resolve, reject) => {
    axios
      .get(url)
      .then((result) => {
        resolve(`${result.data.message}`);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const doNeoFunction = (routineName: string): Promise<string> => {
  const url = `${ROSE_BASE_URL}/neo/${routineName}`;

  return new Promise<string>((resolve, reject) => {
    axios
      .get(url)
      .then((result) => {
        resolve(`${result.data.message}`);
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

export const setStemLight = (isOn: boolean): Promise<any> => {
  const onOffStr = isOn ? "on" : "off";
  const url = `${ROSE_BASE_URL}/stemlight/${onOffStr}`;

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
  const url = `${ROSE_BASE_URL}/neo/color?r=${r}&g=${g}&b=${b}`;

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
