import React, { useRef, useState, useEffect } from "react";
// import { throttle } from "../helpers/timing";

const throttle = (fn, delay) => {
  let lastCall = 0;

  return function (...args) {
    const now = new Date().getTime();

    if (now - lastCall < delay) return;

    lastCall = now;
    return fn(...args);
  };
};

const Canvas = ({ strokeColor = "black", lineWidth = 2, children, lines, setLines }) => {
  const canvasRef = useRef(null);

  // this will run only on first render because it gets passed an empty array as the second argument
  useEffect(() => {
    // set the canvas size based on its parent
    const canvas = canvasRef.current;
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
  }, []);

  // this will run every time a new line is added to state
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    lines.forEach(line => {
      setupLineStyle(ctx, line);
      drawLine(ctx, line.points);
    });
  }, [lines]);

  // Event Handlers
  const handleMouseDown = ({ nativeEvent: { offsetX, offsetY } }) => {
    startDrawing(offsetX, offsetY);
  };

  const handleMouseMove = ({ nativeEvent: { offsetX, offsetY } }) => {
    drawNextPoint(offsetX, offsetY);
  };

  // drawing state
  const tempState = {
    line: {
      points: [],
      strokeColor,
      lineWidth
    },
    isDrawing: false,
    ctx: null
  };

  const startDrawing = (startX, startY) => {
    tempState.ctx = canvasRef.current.getContext("2d");
    tempState.isDrawing = true;
    tempState.line.points.push([startX, startY]);
    setupLineStyle(tempState.ctx, tempState.line);
  };

  const drawNextPoint = (newX, newY) => {
    if (!tempState.isDrawing) return;

    const { points } = tempState.line;
    const [lastX, lastY] = points[points.length - 1];

    if (lastX !== newX || lastY !== newY) {
      // only draw the newly added point
      points.push([newX, newY]);
      drawLine(tempState.ctx, points.slice(-2));
    }
  };

  const endDrawing = () => {
    tempState.isDrawing = false;
    if (tempState.line.points.length) {
      setLines([...lines, tempState.line]);
    }
  };

  // how 2 style the line
  const setupLineStyle = (ctx, line) => {
    ctx.strokeStyle = line.strokeColor;
    ctx.lineWidth = line.lineWidth;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
  };

  // draw all points
  const drawLine = (ctx, points) => {
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    points.slice(1).forEach(([x, y]) => {
      ctx.lineTo(x, y);
    });
    ctx.stroke();
  };

  return (
    <canvas
      style={{
        touchAction: "none",
      }}
      ref={canvasRef}
      onPointerDown={handleMouseDown}
      onPointerMove={throttle(handleMouseMove, 10)}
      onPointerUp={endDrawing}
      onPointerCancel={endDrawing}
    >{children || null}</canvas>
  );
};

export default Canvas;
