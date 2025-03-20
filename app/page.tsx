'use client'
import Toolbar from "@/components/canvas/Toolbar";
import { useState } from "react";

export default function Home() {
  const [color, setColor] = useState("#000000");
  return (
    <div className="min-h-screen bg-background ">
      {/**toolbar */}
      <div className="p-2">
        <Toolbar
        color={color}
        onColorChange={setColor}/>
      </div>
      {/**canvas and layer */}
      <div className="flex p-2">
        <div className="basis-1/3 bg-green-800">layer section</div>
        <div className="flex-grow h-full p-4 basis-2/3 bg-blue-800">canvas section</div>
      </div>
    </div>
  );
}
