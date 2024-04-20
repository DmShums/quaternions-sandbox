import { convertEulerToMatrix } from "./QuaternionConvert";
import {MultiplyTwoMatrices, RotationQuaternion, Vector3} from "./QuaternionLibrary";
import * as THREE from "three";

// class Vector3 {
//   constructor(x, y, z) {
//     this.x = x;
//     this.y = y;
//     this.z = z;
//   }
//   get GetX() {
//     return this.x;
//   }
//   get GetY() {
//     return this.y;
//   }
//   get GetZ() {
//     return this.z;
//   }

//   set SetX(newX) {
//     this.x = newX;
//   }
//   set SetY(newY) {
//     this.y = newY;
//   }
//   set SetZ(newZ) {
//     this.z = newZ;
//   }
// }

export class Euler {
  constructor(x, y, z, order = "XYZ") {
    this.x = x;
    this.y = y;
    this.z = z;
    this.order = order;
  }
  GetX() {
    return this.x;
  }
  GetY() {
    return this.y;
  }
  GetZ() {
    return this.z;
  }
  GetOrder() {
    return this.order;
  }

  SetX(newX) {
    this.x = newX;
  }
  SetY(newY) {
    this.y = newY;
  }
  SetZ(newZ) {
    this.z = newZ;
  }
  SetOrder(newOrder) {
    this.order = newOrder;
  }

  // .copy ( euler : Euler ) : this
  // .clone () : Euler
  // .equals ( euler : Euler ) : Boolean
  // .fromArray ( array : Array ) : this
  // .reorder ( newOrder : String ) : this

  ApplyToThreeObjectAsGlobal(threeObject, norm, parentMesh)
  {
    console.log("Old matrix:" ,norm);

    const globPosParent = new THREE.Vector3();
    parentMesh.getWorldPosition(globPosParent);

    const oldMatrix = norm[0];
    const newMatrix = convertEulerToMatrix(this);
    const postionTransformationMatrix = MultiplyTwoMatrices(oldMatrix, newMatrix);

    console.log("New matrix:", postionTransformationMatrix);

    const initNormPos = norm[1];
    const newTransformedPos = initNormPos.PreMultiplyByMatrix(postionTransformationMatrix);

    const resultWorldPos = new THREE.Vector3(
      newTransformedPos.GetX(),
      newTransformedPos.GetY(),
      newTransformedPos.GetZ()
    );

    resultWorldPos.add(globPosParent);

    console.log("Old child pos:", threeObject.position.toArray());
    console.log("New child pos:", resultWorldPos);
    console.log("<--------------------------------------------------------->");

    norm[0] = postionTransformationMatrix;
    threeObject.position.copy(resultWorldPos);
  }

  set(x, y, z, order) {
    this.SetX(x);
    this.SetY(y);
    this.SetZ(z);
    this.SetOrder(order);
  }

  setFromRotationMatrix(m, order) {}

  setFromQuaternion(q, order, update) {}

  setFromVector3(v, order) {
    this.set(v.x, v.y, v.z, order);
  }

  toArray() {
    return [this.x, this.y, this.z, this.order];
  }
}
