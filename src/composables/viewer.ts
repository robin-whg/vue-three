import {
  ACESFilmicToneMapping,
  BoxGeometry,
  Mesh,
  MeshBasicMaterial,
  PMREMGenerator,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  sRGBEncoding,
} from "three"

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js"

export const useViewer = (canvas: HTMLCanvasElement) => {
  const scene = new Scene()

  const contextAttributes: WebGLContextAttributes = {
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
    alpha: true,
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

  new RGBELoader().load("/adams_place_bridge_1k.hdr", (texture) => {
    // texture.mapping = EquirectangularReflectionMapping
    // scene.environment = texture
    const pmremGenerator = new PMREMGenerator(renderer)
    pmremGenerator.compileEquirectangularShader()
    const envMap = pmremGenerator.fromEquirectangular(texture).texture
    scene.environment = envMap
    texture.dispose()
    pmremGenerator.dispose()
  })

  const material = new MeshBasicMaterial()
  const geometry = new BoxGeometry(1, 1, 1)
  const mesh = new Mesh(geometry, material)
  scene.add(mesh)

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
