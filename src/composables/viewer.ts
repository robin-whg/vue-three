import {
  ACESFilmicToneMapping,
  Box3,
  PMREMGenerator,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer,
  sRGBEncoding,
} from "three"

import type { Group, Object3D } from "three"

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader"

export function useViewer() {
  const canvas = document.createElement("canvas")

  const contextAttributes: WebGLContextAttributes = {
    antialias: true,
    powerPreference: "high-performance",
  }

  const context = canvas.getContext("webgl2")
    ? canvas.getContext("webgl2", contextAttributes)
    : canvas.getContext("webgl", contextAttributes)

  if (!context) throw new Error("no context")

  const renderer = new WebGLRenderer({ canvas, context, alpha: true })
  renderer.toneMapping = ACESFilmicToneMapping
  renderer.toneMappingExposure = 2
  renderer.outputEncoding = sRGBEncoding
  renderer.physicallyCorrectLights = true
  renderer.domElement.style.height = "inherit"
  renderer.domElement.style.width = "inherit"

  const camera = new PerspectiveCamera(75, 2, 0.1, 50)
  camera.position.set(0.25, 1, 1)

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enablePan = true
  controls.enableDamping = true
  controls.dampingFactor = 0.5
  controls.target.set(0, 0, 0)
  controls.update()

  const scene = new Scene()
  const objects: Object3D[] = reactive([])

  new RGBELoader().load("/adams_place_bridge_1k.hdr", (texture) => {
    const pmremGenerator = new PMREMGenerator(renderer)
    pmremGenerator.compileEquirectangularShader()
    const envMap = pmremGenerator.fromEquirectangular(texture).texture
    scene.environment = envMap
    texture.dispose()
    pmremGenerator.dispose()
  })

  let renderRequested = false

  function resizeRenderer(renderer: WebGLRenderer) {
    const canvas = renderer.domElement
    const pixelRatio = window.devicePixelRatio < 3 ? window.devicePixelRatio : 2
    const width = (canvas.clientWidth * pixelRatio) | 0
    const height = (canvas.clientHeight * pixelRatio) | 0
    const needResize = canvas.width !== width || canvas.height !== height
    if (needResize) {
      renderer.setSize(width, height, false)
    }
    return needResize
  }

  function render() {
    const canvas = renderer.domElement
    renderRequested = false

    if (resizeRenderer(renderer)) {
      camera.aspect = canvas.clientWidth / canvas.clientHeight
      camera.updateProjectionMatrix()
    }

    controls.update()
    renderer.render(scene, camera)
  }

  function requestRender() {
    if (!renderRequested) {
      renderRequested = true
      requestAnimationFrame(render)
    }
  }

  onMounted(() => {
    controls.addEventListener("change", requestRender)
    window.addEventListener("resize", requestRender)
  })

  onUnmounted(() => {
    controls.removeEventListener("change", requestRender)
    window.removeEventListener("resize", requestRender)
  })

  function mount(element: HTMLDivElement) {
    element.appendChild(canvas)
  }

  function centerObject(object: Object3D) {
    const box = new Box3().setFromObject(object)
    const boxCenter = box.getCenter(new Vector3())
    object.position.set(boxCenter.x * -1, boxCenter.y * -1, boxCenter.z * -1)
  }

  const progress = ref(0)

  function loadGLTFFile(fileUrl: string): Promise<Group> {
    return new Promise((resolve, reject) => {
      const dracoLoader = new DRACOLoader()
      dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/")
      const loader = new GLTFLoader().setDRACOLoader(dracoLoader)
      loader.load(
        fileUrl,
        (gltf) => {
          const root = gltf.scene
          scene.add(root)
          centerObject(root)
          const newObjects = root.children.flatMap((x) => x)
          objects.push(...newObjects)
          requestRender()
          resolve(gltf.scene)
        },
        (xhr) => {
          progress.value = Math.floor((xhr.loaded / xhr.total) * 100)
        },
        (error) => {
          reject(error)
        }
      )
    })
  }

  function focusSelection(selection: Object3D[], fitOffset = 1.2) {
    const box = new Box3()

    for (const object of selection) box.expandByObject(object)

    const size = box.getSize(new Vector3())
    const center = box.getCenter(new Vector3())

    const maxSize = Math.max(size.x, size.y, size.z)
    const fitHeightDistance =
      maxSize / (2 * Math.atan((Math.PI * camera.fov) / 360))
    const fitWidthDistance = fitHeightDistance / camera.aspect
    const distance = fitOffset * Math.max(fitHeightDistance, fitWidthDistance)

    const direction = controls.target
      .clone()
      .sub(camera.position)
      .normalize()
      .multiplyScalar(distance)

    controls.maxDistance = distance * 10
    controls.target.copy(center)

    camera.near = distance / 100
    camera.far = distance * 100
    camera.updateProjectionMatrix()

    camera.position.copy(controls.target).sub(direction)

    controls.update()

    requestRender()
  }

  return {
    renderer,
    camera,
    controls,
    scene,
    objects,
    mount,
    progress,
    loadGLTFFile,
    focusSelection,
  }
}
