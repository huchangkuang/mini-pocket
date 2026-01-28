import React, { useState } from "react";
import Taro, { useShareAppMessage } from "@tarojs/taro";
import { Canvas, Image, Slider, View } from "@tarojs/components";
import "./index.scss";
import { AtIcon } from "taro-ui";

interface PixelData {
  color: string;
  x: number;
  y: number;
}

const BeadArt: React.FC = () => {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [pixelSize, setPixelSize] = useState<number>(8);
  const [pixelData, setPixelData] = useState<PixelData[]>([]);
  const [canvasSize, setCanvasSize] = useState({ width: 300, height: 300 });

  const chooseImage = () => {
    Taro.chooseImage({
      count: 1,
      sizeType: ["compressed"],
      sourceType: ["album", "camera"],
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0];
        setImageUrl(tempFilePath);
        processImage(tempFilePath);
      },
    });
  };

  const processImage = (imgPath: string) => {
    Taro.getImageInfo({
      src: imgPath,
      success: (imgInfo) => {
        const { width, height } = imgInfo;
        const maxSize = 300;
        let canvasWidth = width;
        let canvasHeight = height;

        if (width > maxSize || height > maxSize) {
          const ratio = Math.min(maxSize / width, maxSize / height);
          canvasWidth = Math.floor(width * ratio);
          canvasHeight = Math.floor(height * ratio);
        }

        setCanvasSize({ width: canvasWidth, height: canvasHeight });

        setTimeout(() => {
          const query = Taro.createSelectorQuery();
          query
            .select("#beadCanvas")
            .fields({ node: true, size: true })
            .exec((res) => {
              if (!res || !res[0]) {
                return;
              }

              const canvas = res[0].node;
              const ctx = canvas.getContext("2d");

              const img = canvas.createImage();
              img.src = imgPath;
              img.onload = () => {
                canvas.width = canvasWidth;
                canvas.height = canvasHeight;
                ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);

                const imageData = ctx.getImageData(
                  0,
                  0,
                  canvasWidth,
                  canvasHeight
                );
                const pixels = extractPixelData(
                  imageData.data,
                  canvasWidth,
                  canvasHeight
                );
                setPixelData(pixels);
              };
            });
        }, 100);
      },
    });
  };

  const extractPixelData = (
    imageData: Uint8ClampedArray,
    width: number,
    height: number
  ): PixelData[] => {
    const pixels: PixelData[] = [];
    const step = Math.max(1, Math.floor(pixelSize));

    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        const index = (y * width + x) * 4;
        const r = imageData[index];
        const g = imageData[index + 1];
        const b = imageData[index + 2];
        const a = imageData[index + 3];

        if (a > 128) {
          const color = rgbToHex(r, g, b);
          pixels.push({ color, x, y });
        }
      }
    }

    return pixels;
  };

  const rgbToHex = (r: number, g: number, b: number): string => {
    return (
      "#" +
      [r, g, b]
        .map((x) => {
          const hex = x.toString(16);
          return hex.length === 1 ? "0" + hex : hex;
        })
        .join("")
    );
  };

  const handlePixelSizeChange = (value: number) => {
    setPixelSize(value);
    if (imageUrl) {
      processImage(imageUrl);
    }
  };

  const clearImage = () => {
    setImageUrl("");
    setPixelData([]);
  };

  useShareAppMessage(() => {
    return {
      title: "拼豆图片生成",
      path: "/pages/beadArt/index",
    };
  });

  return (
    <View className="beadArt">
      <View className="uploadSection">
        {!imageUrl ? (
          <View className="uploadPlaceholder" onClick={chooseImage}>
            <AtIcon value="image" size="60" color="#88d8b0" />
            <View className="uploadText">点击上传图片</View>
          </View>
        ) : (
          <View className="imagePreview">
            <Image src={imageUrl} mode="aspectFit" className="previewImage" />
            <AtIcon
              value="close-circle"
              size="24"
              color="#999"
              className="closeIcon"
              onClick={clearImage}
            />
          </View>
        )}
      </View>

      {imageUrl && (
        <View className="controls">
          <View className="controlItem">
            <View className="controlLabel">像素大小: {pixelSize}px</View>
            <Slider
              value={pixelSize}
              min={7}
              max={15}
              step={1}
              activeColor="#88d8b0"
              backgroundColor="#e0e0e0"
              showValue={false}
              onChange={(e) => handlePixelSizeChange(e.detail.value)}
            />
          </View>
        </View>
      )}

      {pixelData.length > 0 && (
        <View className="pixelDisplay">
          <View className="pixelGrid">
            {pixelData.map((pixel, index) => (
              <View
                key={index}
                className="pixel"
                style={{
                  backgroundColor: pixel.color,
                  left: `${(pixel.x / canvasSize.width) * 100}%`,
                  top: `${(pixel.y / canvasSize.height) * 100}%`,
                  width: `${(pixelSize / canvasSize.width) * 100}%`,
                  height: `${(pixelSize / canvasSize.height) * 100}%`,
                }}
              />
            ))}
          </View>
        </View>
      )}

      <Canvas
        canvasId="beadCanvas"
        id="beadCanvas"
        type="2d"
        style={{
          width: `${canvasSize.width}px`,
          height: `${canvasSize.height}px`,
          position: "absolute",
          left: "-9999px",
          top: "-9999px",
        }}
      />
    </View>
  );
};

export default BeadArt;
