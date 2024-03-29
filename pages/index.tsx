import {
  FaAngleDoubleUp,
  FaDotCircle,
  FaExchangeAlt,
  FaLeaf,
  FaRainbow,
} from "react-icons/fa";
import {
  changeColor,
  doNeoFunction,
  dropPetal,
  setStemLight,
  testConnectivity,
} from "../helpers/api";
import { useEffect, useState } from "react";

import Button from "../components/button";
import ColorButton from "../components/color-button";
import Head from "next/head";
import { IconBaseProps } from "react-icons";
import LogWindow from "../components/log-window";
import type { NextPage } from "next";
import ToggleSwitch from "../components/toggle-switch";
import classnames from "classnames";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  const [logOutput, setLogOutput] = useState("");
  const [connectionSuccessful, setConnectionSuccessful] = useState(false);
  const [color, setColor] = useState({ r: 0, g: 0, b: 0 });
  const [droppedList, setDroppedList] = useState<{ array1: number[] }>({
    array1: [],
  });

  const appendLog = (txt: string) => {
    const newText = txt + "\r\n" + logOutput;
    setLogOutput(newText);
  };

  const hasDropped = (num: number): boolean => {
    return droppedList.array1.filter((x) => x == num).length > 0;
  };

  const doDropPetal = (petalNum: number) => {
    appendLog(`Sending signal to drop petal ${petalNum}`);
    setDroppedList({ array1: [...droppedList.array1, petalNum] });

    dropPetal(petalNum)
      .then((result) => {
        appendLog(result);
      })
      .catch((err) => {
        console.error("Error on doDropPetal");
        appendLog("NETWORK ERROR ON DROPPETAL");
        appendLog(err.message);
      });
  };

  const doChangeColor = (r: number, g: number, b: number) => {
    changeColor(r, g, b)
      .then((result) => {
        appendLog(result.data.message);
      })
      .catch((err) => {
        console.error("Error on doChangeColor");
        appendLog("NETWORK ERROR ON CHANGECOLOR");
        appendLog(err.message);
      });
  };

  const doNeoRoutine = (routineName: string) => {
    doNeoFunction(routineName).then((result) => {
      appendLog(result);
    });
  };

  const doTestConnectivity = () => {
    testConnectivity()
      .then((result) => {
        appendLog(result.data.message);
      })
      .catch((err) => {
        appendLog("ERROR ON CONNECTIVITY TEST");
      });
  };

  const doSetStemLight = (stemIsOn: boolean) => {
    setStemLight(stemIsOn)
      .then((result) => {
        appendLog(result.data.message);
      })
      .catch((err) => {
        appendLog("ERROR ON STEM LIGHT");
      });
  };

  useEffect(() => {
    // try to connect
    testConnectivity()
      .then((result) => {
        setConnectionSuccessful(true);
        setLogOutput("Ready!");
      })
      .catch((err) => {
        setConnectionSuccessful(false);
        setLogOutput(
          "ERROR: API service on device is not responding. Check that the python flask app is up and running."
        );
      });
  }, []);

  return (
    <div className="bg-gray-900">
      <Head>
        <title>Enchanted Rose</title>
        <meta name="description" content="Enchanted rose with falling petals" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className="flex flex-row">
          <div className="mb-3">
            <img
              src="/assets/rose.jpg"
              className={classnames(
                { "w-24 rounded-lg": true },
                { "opacity-10": !connectionSuccessful },
                { "opacity-100": connectionSuccessful }
              )}
            />
          </div>
        </div>

        <div className="mt-4 max-w-sm">
          <div className="mb-8">
            <div className="mb-4 w-full text-center font-extralight text-sm">
              Stem Light
            </div>
            <div className="flex justify-center">
              <ToggleSwitch
                onChange={(stemIsOn) => {
                  doSetStemLight(stemIsOn);
                }}
              />
            </div>
          </div>

          <div>
            <div className="w-full text-center font-extralight text-sm">
              Accent Light
            </div>

            <div className="mt-4 flex justify-start gap-4">
              <ColorButton
                currentColor={color}
                onClick={(colorResult) => {
                  setColor(colorResult);
                  doChangeColor(colorResult.r, colorResult.g, colorResult.b);
                }}
                color={{
                  r: 255,
                  g: 0,
                  b: 100,
                }}
              />
              <ColorButton
                currentColor={color}
                onClick={(colorResult) => {
                  setColor(colorResult);
                  doChangeColor(colorResult.r, colorResult.g, colorResult.b);
                }}
                color={{
                  r: 255,
                  g: 100,
                  b: 0,
                }}
              />
              <ColorButton
                currentColor={color}
                onClick={(colorResult) => {
                  setColor(colorResult);
                  doChangeColor(colorResult.r, colorResult.g, colorResult.b);
                }}
                color={{
                  r: 0,
                  g: 100,
                  b: 0,
                }}
              />
              <ColorButton
                currentColor={color}
                onClick={(colorResult) => {
                  setColor(colorResult);
                  doChangeColor(colorResult.r, colorResult.g, colorResult.b);
                }}
                color={{
                  r: 0,
                  g: 0,
                  b: 255,
                }}
              />
              <ColorButton
                currentColor={color}
                onClick={(colorResult) => {
                  setColor(colorResult);
                  doChangeColor(colorResult.r, colorResult.g, colorResult.b);
                }}
                color={{
                  r: 255,
                  g: 255,
                  b: 5,
                }}
              />
              <ColorButton
                currentColor={color}
                onClick={(colorResult) => {
                  setColor(colorResult);
                  doChangeColor(colorResult.r, colorResult.g, colorResult.b);
                }}
                color={{
                  r: 0,
                  g: 0,
                  b: 0,
                }}
              />
            </div>
          </div>

          <div className="mb-8">
            <div className="w-full text-center font-extralight text-sm"></div>

            <div className="mt-4 flex justify-center gap-4">
              <Button
                label={"Rainbow"}
                iconObj={FaRainbow}
                onClick={() => {
                  doNeoRoutine("rainbow");
                }}
              />
              <Button
                label={"Chase"}
                iconObj={FaDotCircle}
                onClick={() => {
                  doNeoRoutine("chase");
                }}
              />
              <Button
                label={"Pulse"}
                iconObj={FaAngleDoubleUp}
                onClick={() => {
                  doNeoRoutine("pulse");
                }}
              />
            </div>
          </div>

          <div>
            <div className="w-full text-center font-extralight text-sm">
              Petal Drop
            </div>
            <div className="mt-4 flex justify-center gap-6">
              <div>
                <div
                  className={classnames("", { "opacity-50": hasDropped(1) })}
                >
                  <Button
                    onClick={() => doDropPetal(1)}
                    iconObj={FaLeaf}
                    label="1"
                  />
                </div>
              </div>
              <div>
                <div
                  className={classnames("", { "opacity-50": hasDropped(2) })}
                >
                  <Button
                    onClick={() => doDropPetal(2)}
                    iconObj={FaLeaf}
                    label="2"
                  />
                </div>
              </div>
              <div>
                <div
                  className={classnames("", { "opacity-50": hasDropped(3) })}
                >
                  <Button
                    onClick={() => doDropPetal(3)}
                    iconObj={FaLeaf}
                    label="3"
                  />
                </div>
              </div>
              <div>
                <div
                  className={classnames("", { "opacity-50": hasDropped(4) })}
                >
                  <Button
                    onClick={() => doDropPetal(4)}
                    iconObj={FaLeaf}
                    label="4"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 w-full mx-auto">
            <LogWindow
              onClearClicked={() => {
                setLogOutput("");
              }}
              text={logOutput}
            />
          </div>
          <div className="mt-2 flex justify-center">
            <Button
              onClick={() => {
                doTestConnectivity();
              }}
              iconObj={FaExchangeAlt}
              label="Test connection"
            />
          </div>
        </div>
        <div className="mt-8 mb-8 text-xs text-extralight">
          <a
            className="text-extralight  text-xs"
            href="https://www.stevemurch.com/category/tech/maker-projects"
            target="_blank"
            rel="noreferrer"
          >
            <span className="text-gray-600 hover:text-gray-200">
              &copy; 2023 Steve Murch
            </span>
          </a>
        </div>
      </main>
    </div>
  );
};

export default Home;
