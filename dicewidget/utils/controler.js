import { createD4 } from "../dice/d4.js";
import { createD8 } from "../dice/d8.js";
import { createD10 } from "../dice/d10.js";
import { createD20 } from "../dice/d20.js";

const diceFactories = {
  d4: createD4,
  d8: createD8,
  d10: createD10,
  d20: createD20,
};

// ✅ Color sanitizer for any dice type
function safeColor(input) {
  if (!input) return '#ffffff'; // default white

  // Convert to string & clean
  let c = input.toString().trim().toLowerCase();

  // ✅ If 8-digit hex (#rrggbbaa) → strip alpha
  if (c.startsWith('#') && c.length === 9) {
    c = c.substring(0, 7);
  }

  // ✅ If valid 6-digit hex (#rrggbb)
  if (c.startsWith('#') && c.length === 7) {
    return c;
  }

  // ✅ If numeric hex (0xrrggbb)
  if (/^0x[0-9a-f]{6}$/i.test(c)) {
    return parseInt(c, 16); // return as number
  }

  // ✅ If rgb or hsl string, just return it
  if (c.startsWith('rgb') || c.startsWith('hsl')) {
    return c;
  }

  // Fallback
  console.warn(`⚠️ Invalid color "${input}", defaulting to white`);
  return '#ffffff';
}

export class DiceController {
  constructor(scene, camera, renderer) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.die = null;
    this.idleRotation = true;
  }

  setDice(type, faces, color) {
    // Clean any weird color before passing to dice factory
    const cleanColor = safeColor(color);

    if (this.die && this.die.mesh) {
      this.scene.remove(this.die.mesh);
    }

    const factory = diceFactories[type.toLowerCase()];
    if (!factory) throw new Error(`Unsupported dice type: ${type}`);

    //  Pass safe color to the dice creation function
    this.die = factory(faces, cleanColor);

    if (!this.die.mesh || !this.die.mesh.isObject3D) {
      console.error("Returned dice must have a `.mesh` of type THREE.Object3D");
      return;
    }

    this.scene.add(this.die.mesh);
  }

  roll(targetValue) {
    return new Promise(resolve => {
      if (!this.die || !this.die.mesh || !this.die.rollTo) {
        console.error('Die is not initialized or missing rollTo function');
        return resolve(null);
      }

      this.idleRotation = false;

      this.die.rollTo(targetValue - 1).then(() => {
        this.idleRotation = true;
        resolve(targetValue);
      });
    });
  }

  snapToFace(value) {
    const faceIndex = Number(value) - 1;
    if (this.die.rollTo && typeof this.die.rollTo === "function") {
      return this.die.rollTo(faceIndex);
    }
  }

  update() {
    if (this.idleRotation && this.die && this.die.mesh) {
      this.die.mesh.rotation.y += 0.005;
      this.die.mesh.rotation.x += 0.003;
    }
  }
}
