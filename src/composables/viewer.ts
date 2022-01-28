import {
  ACESFilmicToneMapping,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  sRGBEncoding,
} from "three"

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

export const useViewer = (canvas: HTMLCanvasElement) => {
  const scene = new Scene()

  const contextAttributes: WebGLContextAttributes = {
    alpha: true,
    antialias: true,
    powerPreference: "high-performance",
  }

  const context = canvas.getContext("webgl2")
    ? canvas.getContext("webgl2", contextAttributes)
    : canvas.getContext("webgl", contextAttributes)

  if (!context) return

  const renderer = new WebGLRenderer({
    canvas,
    context,
  })
  renderer.toneMapping = ACESFilmicToneMapping
  renderer.toneMappingExposure = 2
  renderer.outputEncoding = sRGBEncoding
  renderer.physicallyCorrectLights = true

  // Camera
  const fov = 75
  const aspect = 2
  const near = 0.1
  const far = 50
  const camera = new PerspectiveCamera(fov, aspect, near, far)
  camera.position.set(0.25, 1, 1)

  // Controls
  const controls = new OrbitControls(camera, canvas)
  controls.enablePan = true
  controls.enableDamping = true
  controls.dampingFactor = 0.5
  controls.target.set(0, 0, 0)
  controls.update()

  // Rendering
  function resizeRenderer(renderer: WebGLRenderer) {
    const pixelRatio = window.devicePixelRatio < 3 ? window.devicePixelRatio : 2
    const width = (canvas.clientWidth * pixelRatio) | 0
    const height = (canvas.clientHeight * pixelRatio) | 0
    const needResize = canvas.width !== width || canvas.height !== height
    if (needResize) {
      renderer.setSize(width, height, false)
    }
    return needResize
  }

  let renderRequested: true | false | undefined = false

  function render() {
    renderRequested = undefined

    if (resizeRenderer(renderer)) {
      const canvas = renderer.domElement
      camera.aspect = canvas.clientWidth / canvas.clientHeight
      camera.updateProjectionMatrix()
    }

    controls.update()
    renderer.render(scene, camera)
  }

  render()

  function requestRender() {
    if (!renderRequested) {
      renderRequested = true
      requestAnimationFrame(render)
    }
  }

  controls.addEventListener("change", requestRender)
  window.addEventListener("resize", requestRender)
}
