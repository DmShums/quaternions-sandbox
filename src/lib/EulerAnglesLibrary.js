import { convertEulerToMatrix, convertMatrixToEuler } from "./QuaternionConvert";
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

export function ApplyStandartizedOrderRotationIntrinsic(threeMesh, euler)
{
  threeMesh.rotateZ((euler.GetZ() * Math.PI)/180);
  threeMesh.rotateY((euler.GetY() * Math.PI)/180);
  threeMesh.rotateX((euler.GetX() * Math.PI)/180);
}

export function ApplyStandartizedOrderRotationExtrinsic(threeMesh, newParentEulerIntrinsic, parentGlobalEuler)
{
  threeMesh.rotateOnWorldAxis(new THREE.Vector3(1,0,0), (-parentGlobalEuler.GetX() * Math.PI)/180);
  threeMesh.rotateOnWorldAxis(new THREE.Vector3(0,1,0), (-parentGlobalEuler.GetY() * Math.PI)/180);
  threeMesh.rotateOnWorldAxis(new THREE.Vector3(0,0,1), (-parentGlobalEuler.GetZ() * Math.PI)/180);

  threeMesh.rotateOnWorldAxis(new THREE.Vector3(0,0,1), (newParentEulerIntrinsic.GetZ() * Math.PI)/180);
  threeMesh.rotateOnWorldAxis(new THREE.Vector3(0,1,0), (newParentEulerIntrinsic.GetY() * Math.PI)/180);
  threeMesh.rotateOnWorldAxis(new THREE.Vector3(1,0,0), (newParentEulerIntrinsic.GetX() * Math.PI)/180);

  threeMesh.rotateOnWorldAxis(new THREE.Vector3(0,0,1), (parentGlobalEuler.GetZ() * Math.PI)/180);
  threeMesh.rotateOnWorldAxis(new THREE.Vector3(0,1,0), (parentGlobalEuler.GetY() * Math.PI)/180);
  threeMesh.rotateOnWorldAxis(new THREE.Vector3(1,0,0), (parentGlobalEuler.GetX() * Math.PI)/180);
}

export function GetVectorTransformMatrix(euler, norm)
{
  const oldMatrix = norm[0];
  const newMatrix = convertEulerToMatrix(euler);
  const postionTransformationMatrix = MultiplyTwoMatrices(oldMatrix, newMatrix);

  return postionTransformationMatrix;
}

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
    const globPosParent = new THREE.Vector3();
    parentMesh.getWorldPosition(globPosParent);

    const postionTransformationMatrix = GetVectorTransformMatrix(this, norm);

    const initNormPos = norm[1];
    const newTransformedPos = initNormPos.PreMultiplyByMatrix(postionTransformationMatrix);

    const resultWorldPos = new THREE.Vector3(
      newTransformedPos.GetX(),
      newTransformedPos.GetY(),
      newTransformedPos.GetZ()
    );

    resultWorldPos.add(globPosParent);
    norm[0] = postionTransformationMatrix;

    threeObject.position.copy(resultWorldPos);
    
    // ApplyStandartizedOrderRotationIntrinsic(threeObject, this);
    const parentEuler = parentMesh.rotation;
    const radToDeg = 180/Math.PI;
    const customParentEuler = new Euler(parentEuler.x * radToDeg, parentEuler.y * radToDeg, parentEuler.z * radToDeg);
    ApplyStandartizedOrderRotationExtrinsic(threeObject, this, customParentEuler);
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

  applyRotationToObject(object) {
    const threeEuler = new THREE.Euler(this.x, this.y, this.z, this.order);
    object.rotation.copy(threeEuler);
  }
}
