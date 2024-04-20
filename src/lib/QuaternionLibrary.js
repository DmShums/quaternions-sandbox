import * as THREE from "three";

export class Vector3 {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
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

  SetX(newX) {
    this.x = newX;
  }
  SetY(newY) {
    this.y = newY;
  }
  SetZ(newZ) {
    this.z = newZ;
  }

  AddAnother(anotherVector) {
    return new Vector3(
      anotherVector.GetX() + this.x,
      anotherVector.GetY() + this.y,
      anotherVector.GetZ() + this.z
    );
  }

  Length()
  {
    let len = Math.sqrt(this.x*this.x + this.y*this.y + this.z * this.z);
    return len;
  }

  MultScalar(scalar) {
    return new Vector3(this.x * scalar, this.y * scalar, this.z * scalar);
  }

  CrossProductAsFirst(otherAsSecond) {
    const newX = this.y * otherAsSecond.GetZ() - this.z * otherAsSecond.GetY();
    const newY = this.x * otherAsSecond.GetZ() - this.z * otherAsSecond.GetX();
    const newZ = this.x * otherAsSecond.GetY() - this.y * otherAsSecond.GetX();
    return new Vector3(newX, newY, newZ);
  }

  PreMultiplyByMatrix(matrix)
  {
    console.log(matrix);
    let transformedVector = new Vector3(0,0,0);
    let newX = matrix[0][0]*this.x + matrix[0][1]*this.y + matrix[0][2]*this.z;
    let newY = matrix[1][0]*this.x + matrix[1][1]*this.y + matrix[1][2]*this.z;
    let newZ = matrix[2][0]*this.x + matrix[2][1]*this.y + matrix[2][2]*this.z;

    console.log("X:",newX,"; Y:", newY,"; Z:", newZ);
    console.log("--------------------------------------------");

    transformedVector.SetX(newX);
    transformedVector.SetY(newY);
    transformedVector.SetZ(newZ);
    return transformedVector;
  }
}

function DotProduct(vector1, vector2) {
  return (
    vector1.GetX() * vector2.GetX() +
    vector1.GetY() * vector2.GetY() +
    vector1.GetZ() * vector2.GetZ()
  );
}

export class RotationQuaternion {
  constructor(x, y, z, a) {
    let norm = Math.sqrt(x * x + y * y + z * z);
    if (norm != 0) {
      let invNorm = 1 / norm;
      x *= invNorm;
      y *= invNorm;
      z *= invNorm;
    }

    const cos_a2 = Math.cos(a / 2);
    const sin_a2 = Math.sin(a / 2);

    this.q_0 = cos_a2;
    this.q_1 = x * sin_a2;
    this.q_2 = y * sin_a2;
    this.q_3 = z * sin_a2;
  }

  static ConstructQuaternionFromAxes(q_0, q_1, q_2, q_3) {
    const newQuaternion = new RotationQuaternion(0, 0, 0, 0);
    newQuaternion.SetQ_0(q_0);
    newQuaternion.SetQ_1(q_1);
    newQuaternion.SetQ_2(q_2);
    newQuaternion.SetQ_3(q_3);
    return newQuaternion;
  }

  static ConstructQuaternionFromThree(threeQuat) {
    return this.ConstructQuaternionFromAxes(
      threeQuat.w,
      threeQuat.x,
      threeQuat.y,
      threeQuat.z
    );
  }

  GetQ_0() {
    return this.q_0;
  }
  GetQ_1() {
    return this.q_1;
  }
  GetQ_2() {
    return this.q_2;
  }
  GetQ_3() {
    return this.q_3;
  }

  SetQ_0(newq_0) {
    this.q_0 = newq_0;
  }
  SetQ_1(newq_1) {
    this.q_1 = newq_1;
  }
  SetQ_2(newq_2) {
    this.q_2 = newq_2;
  }
  SetQ_3(newq_3) {
    this.q_3 = newq_3;
  }

  PostMultiplyThisAsFirst(anotherQuaternion) {
    const t_0 =
      this.q_0 * anotherQuaternion.GetQ_0() -
      this.q_1 * anotherQuaternion.GetQ_1() -
      this.q_2 * anotherQuaternion.GetQ_2() -
      this.q_3 * anotherQuaternion.GetQ_3();
    const t_1 =
      this.q_0 * anotherQuaternion.GetQ_1() +
      this.q_1 * anotherQuaternion.GetQ_0() +
      this.q_2 * anotherQuaternion.GetQ_3() -
      this.q_3 * anotherQuaternion.GetQ_2() ;
    const t_2 =
      this.q_0 * anotherQuaternion.GetQ_2() -
      this.q_1 * anotherQuaternion.GetQ_3() +
      this.q_3 * anotherQuaternion.GetQ_1() +
      this.q_2 * anotherQuaternion.GetQ_0() ;
    const t_3 =
      this.q_0 * anotherQuaternion.GetQ_3() -
      this.q_2 * anotherQuaternion.GetQ_1() +
      this.q_1 * anotherQuaternion.GetQ_2() +
      this.q_3 * anotherQuaternion.GetQ_0();

    return RotationQuaternion.ConstructQuaternionFromAxes(
      t_0,
      t_1,
      t_2,
      t_3
    );  
  }

  PreMultiplyThisAsSecond(anotherQuaternion) {
    const t_0 =
      this.q_0 * anotherQuaternion.GetQ_0() -
      this.q_1 * anotherQuaternion.GetQ_1() -
      this.q_2 * anotherQuaternion.GetQ_2() -
      this.q_3 * anotherQuaternion.GetQ_3();
    const t_1 =
      this.q_1 * anotherQuaternion.GetQ_0() +
      this.q_0 * anotherQuaternion.GetQ_1() +
      this.q_3 * anotherQuaternion.GetQ_2() -
      this.q_2 * anotherQuaternion.GetQ_3() ;
    const t_2 =
      this.q_2 * anotherQuaternion.GetQ_0() -
      this.q_3 * anotherQuaternion.GetQ_1() +
      this.q_1 * anotherQuaternion.GetQ_3() +
      this.q_0 * anotherQuaternion.GetQ_2() ;
    const t_3 =
      this.q_3 * anotherQuaternion.GetQ_0() -
      this.q_1 * anotherQuaternion.GetQ_2() +
      this.q_2 * anotherQuaternion.GetQ_1() +
      this.q_0 * anotherQuaternion.GetQ_3();
    return RotationQuaternion.ConstructQuaternionFromAxes(
      t_0,
      t_1,
      t_2,
      t_3
    );
  }

  GetInverse() {
    return RotationQuaternion.ConstructQuaternionFromAxes(
      this.q_0,
      -this.q_1,
      -this.q_2,
      -this.q_3
    );
  }

  Normalized() {
    let norm = Math.sqrt(
      this.q_0 * this.q_0 +
        this.q_1 * this.q_1 +
        this.q_2 * this.q_2 +
        this.q_3 * this.q_3
    );

    let invNorm = 1;
    if (norm != 0) {
      invNorm = 1 / norm;
    }
    return RotationQuaternion.ConstructQuaternionFromAxes(
      this.q_0 * invNorm,
      this.q_1 * invNorm,
      this.q_2 * invNorm,
      this.q_3 * invNorm
    );
  }

  RotateVectorActive(vectorToRotate) {
    const vectorAsQuat = RotationQuaternion.ConstructQuaternionFromAxes(
      0,
      vectorToRotate.GetX(),
      vectorToRotate.GetY(),
      vectorToRotate.GetZ()
    );
    const inverseQuat = this.GetInverse();
    const result = inverseQuat.PostMultiplyThisAsFirst(vectorAsQuat).PostMultiplyThisAsFirst(this);

    return new Vector3(result.GetQ_1(), result.GetQ_2(), result.GetQ_3());
  }

  RotateVectorPassive(vectorToRotate) {
    const vectorAsQuat = RotationQuaternion.ConstructQuaternionFromAxes(
      0,
      vectorToRotate.GetX(),
      vectorToRotate.GetY(),
      vectorToRotate.GetZ()
    );
    const inverseQuat = this.GetInverse();
    const result = this.PostMultiplyThisAsFirst(vectorAsQuat).PostMultiplyThisAsFirst(inverseQuat);

    return new Vector3(result.GetQ_1(), result.GetQ_2(), result.GetQ_3());
  }

  ApplyToThreeObjectDirect(threeObject) {
    let objQuat = new THREE.Quaternion();
    threeObject.getWorldQuaternion(objQuat);

    let customObjQuat = RotationQuaternion.ConstructQuaternionFromThree(objQuat).Normalized();

    let resultQuat = this.PostMultiplyThisAsFirst(customObjQuat);

    const threeQuat = new THREE.Quaternion(
      resultQuat.GetQ_1(),
      resultQuat.GetQ_2(),
      resultQuat.GetQ_3(),
      resultQuat.GetQ_0()
    );

    threeQuat.normalize();

    threeObject.quaternion.copy(threeQuat);
  }

  ApplyToThreeObjectAsGlobal(threeObject, parentMesh) {
    this.ApplyToThreeObjectDirect(threeObject);

    if (parentMesh) {
      const globPosChild = new THREE.Vector3();
      threeObject.getWorldPosition(globPosChild);

      const globPosParent = new THREE.Vector3();
      parentMesh.getWorldPosition(globPosParent);

      globPosChild.sub(globPosParent);

      const customLocalPos = new Vector3(globPosChild.x, globPosChild.y, globPosChild.z);
      const transformedCustomLocalPos = this.RotateVectorPassive(customLocalPos);
      const resultWorldPos = new THREE.Vector3(
        transformedCustomLocalPos.GetX(),
        transformedCustomLocalPos.GetY(),
        transformedCustomLocalPos.GetZ()
      );

      resultWorldPos.add(globPosParent);
      console.log(globPosParent.distanceTo(resultWorldPos));

      threeObject.position.copy(resultWorldPos);
    }
  }
}
