import React, { useState } from 'react';
import './App.css'

import Canvas from './Canvas'

const imageData = [
  {
    name: "Earth",
    image: "http://jpl.nasa.gov/images/earth/earth-globe-browse.jpg",
    lines: []
  },
  {
    name: "Earth",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/The_Sun_by_the_Atmospheric_Imaging_Assembly_of_NASA%27s_Solar_Dynamics_Observatory_-_20100819.jpg/220px-The_Sun_by_the_Atmospheric_Imaging_Assembly_of_NASA%27s_Solar_Dynamics_Observatory_-_20100819.jpg",
    lines: []
  }
]

function App() {
  const [imageIndex, setImageIndex] = useState(0)
  const [images, setImages] = useState(imageData)

  const handleBackClick = () => {
    if (imageIndex > 0) {
      setImageIndex(imageIndex - 1)
    }
  }

  const handleForwardClick = () => {
    if (imageIndex < images.length - 1) {
      setImageIndex(imageIndex + 1)
    }
  }

  const setLines = lines => {
    const updatedImages = images.map((image, index) => {
      if (index === imageIndex) {
        return { ...image, lines }
      } else {
        return image
      }
    })
    setImages(updatedImages)
  }

  return (
    <div id="main">
      <nav onClick={handleBackClick}>←</nav>
      <div id="translation-area">
        <div className="square">
          <img src={images[imageIndex].image} alt={images[imageIndex].name} />
        </div>
        <div className="square">
          <Canvas lines={images[imageIndex].lines} setLines={setLines}>
            D'oh.
          </Canvas>
        </div>
      </div>
      <nav onClick={handleForwardClick}>→</nav>
    </div>
  );
}

export default App;
