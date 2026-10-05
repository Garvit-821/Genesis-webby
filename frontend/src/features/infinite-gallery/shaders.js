/**
 * cg-phantom-gallery tutorial style:
 * one fullscreen quad + infinite grid reconstructed in the fragment shader.
 */

export const vertexShader = /* glsl */ `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const fragmentShader = /* glsl */ `
uniform vec2 uOffset;
uniform vec2 uResolution;
uniform vec4 uBorderColor;
uniform vec4 uHoverColor;
uniform vec4 uBackgroundColor;
uniform vec2 uMousePos;
uniform float uZoom;
uniform float uCellSize;
uniform float uTextureCount;
uniform sampler2D uImageAtlas;
uniform sampler2D uTextAtlas;
uniform float uHasTextAtlas;

varying vec2 vUv;

void main() {
  vec2 screenUV = (vUv - 0.5) * 2.0;
  float radius = length(screenUV);

  // Barrel-style lens distortion (tutorial)
  float distortion = 1.0 - 0.08 * radius * radius;
  vec2 distortedUV = screenUV * distortion;

  vec2 aspectRatio = vec2(uResolution.x / uResolution.y, 1.0);
  vec2 worldCoord = distortedUV * aspectRatio;
  worldCoord *= uZoom;
  worldCoord += uOffset;

  vec2 cellPos = worldCoord / uCellSize;
  vec2 cellId = floor(cellPos);
  vec2 cellUV = fract(cellPos);

  // Mouse → same world space for hover
  vec2 mouseScreenUV = (uMousePos / uResolution) * 2.0 - 1.0;
  mouseScreenUV.y = -mouseScreenUV.y;
  float mouseRadius = length(mouseScreenUV);
  float mouseDistortion = 1.0 - 0.08 * mouseRadius * mouseRadius;
  vec2 mouseDistortedUV = mouseScreenUV * mouseDistortion;
  vec2 mouseWorldCoord = mouseDistortedUV * aspectRatio;
  mouseWorldCoord *= uZoom;
  mouseWorldCoord += uOffset;

  vec2 mouseCellPos = mouseWorldCoord / uCellSize;
  vec2 mouseCellId = floor(mouseCellPos);

  // Soft grid borders
  float lineWidth = 0.005;
  float gridX = smoothstep(0.0, lineWidth, cellUV.x) * smoothstep(1.0, 1.0 - lineWidth, cellUV.x);
  float gridY = smoothstep(0.0, lineWidth, cellUV.y) * smoothstep(1.0, 1.0 - lineWidth, cellUV.y);
  float gridMask = gridX * gridY;

  vec3 backgroundColor = uBackgroundColor.rgb;

  vec2 cellCenter = cellId + 0.5;
  vec2 mouseCellCenter = mouseCellId + 0.5;
  float cellDistance = length(cellCenter - mouseCellCenter);
  float hoverIntensity = 1.0 - smoothstep(0.0, 1.15, cellDistance);
  bool isHovered = hoverIntensity > 0.0 && uMousePos.x >= 0.0;

  if (isHovered) {
    backgroundColor = mix(backgroundColor, uHoverColor.rgb, hoverIntensity * uHoverColor.a);
  }

  // Image inset inside each cell
  float imageSize = 0.6;
  float imageBorder = (1.0 - imageSize) * 0.5;
  vec2 imageUV = (cellUV - imageBorder) / imageSize;

  float edgeSmooth = 0.01;
  vec2 imageMask = smoothstep(0.0, edgeSmooth, imageUV)
                 * smoothstep(1.0, 1.0 - edgeSmooth, imageUV);
  float imageAlpha = imageMask.x * imageMask.y;
  bool inImageArea = imageUV.x >= 0.0 && imageUV.x <= 1.0
                  && imageUV.y >= 0.0 && imageUV.y <= 1.0;

  float textHeight = 0.08;
  float textY = 0.88;
  bool inTextArea = cellUV.x > 0.05 && cellUV.x < 0.95
                 && cellUV.y > textY && cellUV.y < textY + textHeight;

  // Infinite repeating texture index from cell id
  float texIndex = mod(cellId.x + cellId.y * 4.0, uTextureCount);
  if (texIndex < 0.0) texIndex += uTextureCount;

  vec3 color = backgroundColor;

  if (inImageArea && imageAlpha > 0.0) {
    float atlasSize = ceil(sqrt(uTextureCount));
    vec2 atlasPos = vec2(mod(texIndex, atlasSize), floor(texIndex / atlasSize));
    // CanvasTexture flipY handles orientation — no extra invert.
    vec2 atlasUV = (atlasPos + imageUV) / atlasSize;
    vec3 imageColor = texture2D(uImageAtlas, atlasUV).rgb;
    color = mix(backgroundColor, imageColor, imageAlpha);
  }

  if (inTextArea && uHasTextAtlas > 0.5) {
    vec2 textCoord = vec2(
      (cellUV.x - 0.05) / 0.9,
      (cellUV.y - textY) / textHeight
    );

    float atlasSize = ceil(sqrt(uTextureCount));
    vec2 atlasPos = vec2(mod(texIndex, atlasSize), floor(texIndex / atlasSize));
    vec2 atlasUV = (atlasPos + textCoord) / atlasSize;

    vec4 textColor = texture2D(uTextAtlas, atlasUV);
    color = mix(color, textColor.rgb, textColor.a);
  }

  // Cell borders
  vec3 borderRGB = uBorderColor.rgb;
  float borderAlpha = uBorderColor.a;
  color = mix(color, borderRGB, (1.0 - gridMask) * borderAlpha);

  // Radial vignette fade
  float fade = 1.0 - smoothstep(1.2, 1.8, radius);
  gl_FragColor = vec4(color * fade, 1.0);
}
`;
