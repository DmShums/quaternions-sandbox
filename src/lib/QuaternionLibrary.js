import * as THREE from "three";

class Vector3 {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  get GetX() {
    return this.x;
  }
  get GetY() {
    return this.y;
  }
  get GetZ() {
    return this.z;
  }

  set SetX(newX) {
    this.x = newX;
  }
  set SetY(newY) {
    this.y = newY;
  }
  set SetZ(newZ) {
    this.z = newZ;
  }
}

export class RotationQuaternion {
  constructor(x, y, z, a) {
    let norm = Math.sqrt(x*x + y*y + z*z );
    let invNorm = 1/norm;
    x *= invNorm;
    y *= invNorm;
    z *= invNorm;

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

  get GetQ_0() {
    return this.q_0;
  }
  get GetQ_1() {
    return this.q_1;
  }
  get GetQ_2() {
    return this.q_2;
  }
  get GetQ_3() {
    return this.q_3;
  }

  set SetQ_0(newq_0) {
    this.q_0 = newq_0;
  }
  set SetQ_1(newq_1) {
    this.q_1 = newq_1;
  }
  set SetQ_2(newq_2) {
    this.q_2 = newq_2;
  }
  set SetQ_3(newq_3) {
    this.q_3 = newq_3;
  }

  PostMultiply(anotherQuaternion) {
    const t_0 =
      this.q_0 * anotherQuaternion.GetQ_0() -
      this.q_1 * anotherQuaternion.GetQ_1() -
      this.q_2 * anotherQuaternion.GetQ_2() -
      this.q_3 * anotherQuaternion.GetQ_3();
    const t_1 =
      this.q_0 * anotherQuaternion.GetQ_1() +
      this.q_1 * anotherQuaternion.GetQ_0() -
      this.q_2 * anotherQuaternion.GetQ_3() +
      this.q_3 * anotherQuaternion.GetQ_2();
    const t_2 =
      this.q_0 * anotherQuaternion.GetQ_2() +
      this.q_1 * anotherQuaternion.GetQ_3() +
      this.q_2 * anotherQuaternion.GetQ_0() -
      this.q_3 * anotherQuaternion.GetQ_1();
    const t_3 =
      this.q_0 * anotherQuaternion.GetQ_3() -
      this.q_1 * anotherQuaternion.GetQ_2() +
      this.q_2 * anotherQuaternion.GetQ_1() +
      this.q_3 * anotherQuaternion.GetQ_0();
    return RotationQuaternion.ConstructQuaternionFromAxes(t_0, t_1, t_2, t_3).Normalized();
  }

  PreMultiply(anotherQuaternion) {
    const t_0 =
      this.q_0 * anotherQuaternion.GetQ_0() -
      this.q_1 * anotherQuaternion.GetQ_1() -
      this.q_2 * anotherQuaternion.GetQ_2() -
      this.q_3 * anotherQuaternion.GetQ_3();
    const t_1 =
      this.q_1 * anotherQuaternion.GetQ_0() +
      this.q_0 * anotherQuaternion.GetQ_1() -
      this.q_3 * anotherQuaternion.GetQ_2() +
      this.q_2 * anotherQuaternion.GetQ_3();
    const t_2 =
      this.q_2 * anotherQuaternion.GetQ_0() +
      this.q_3 * anotherQuaternion.GetQ_1() +
      this.q_0 * anotherQuaternion.GetQ_2() -
      this.q_1 * anotherQuaternion.GetQ_3();
    const t_3 =
      this.q_3 * anotherQuaternion.GetQ_0() -
      this.q_2 * anotherQuaternion.GetQ_1() +
      this.q_1 * anotherQuaternion.GetQ_2() +
      this.q_0 * anotherQuaternion.GetQ_3();
    return RotationQuaternion.ConstructQuaternionFromAxes(t_0, t_1, t_2, t_3).Normalized();
  }

  GetInverse() {
    return RotationQuaternion.ConstructQuaternionFromAxes(
      this.q_0,
      -this.q_1,
      -this.q_2,
      -this.q_3
    );
  }

  Normalized()
  {
    let norm = Math.sqrt(this.q_0*this.q_0 + this.q_1*this.q_1 + this.q_2*this.q_2 + this.q_3*this.q_3);
    let invNorm = 1/norm;

    return RotationQuaternion.ConstructQuaternionFromAxes(this.q_0 * invNorm, this.q_1 * invNorm, this.q_2 * invNorm, this.q_3 * invNorm);
  }

  RotateVectorActive(vectorToRotate) {
    const vectorAsQuat = RotationQuaternion.ConstructQuaternionFromAxes(
      0,
      vectorToRotate.GetX(),
      vectorToRotate.GetY(),
      vectorToRotate.GetZ()
    );
    const inverseQuat = this.GetInverse();
    const result = inverseQuat.PostMultiply(vectorAsQuat).PostMultiply(this);

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
    const result = this.PostMultiply(vectorAsQuat).PostMultiply(inverseQuat);

    return new Vector3(result.GetQ_1(), result.GetQ_2(), result.GetQ_3());
  }

  ApplyToThreeObjectDirect(threeObject) {
    let objQuat = threeObject.quaternion;
    let customObjQuat = RotationQuaternion.ConstructQuaternionFromAxes(objQuat.x, objQuat.y, objQuat.z, objQuat.w).Normalized();

    let resultQuat = customObjQuat.PreMultiply(this);
    const threeQuat = new THREE.Quaternion(
      resultQuat.GetQ_0,
      resultQuat.GetQ_1,
      resultQuat.GetQ_2,
      resultQuat.GetQ_3
    );

    threeObject.setRotationFromQuaternion(threeQuat);
  }

  ApplyToThreeObjectAsGlobal(threeObject, parentGlobalQuaternion, parentMesh) {
    let objQuat = threeObject.quaternion;
    let customObjQuat = RotationQuaternion.ConstructQuaternionFromAxes(objQuat.x, objQuat.y, objQuat.z, objQuat.w);

    let resultQuat = customObjQuat.PreMultiply(this).PreMultiply(parentGlobalQuaternion).Normalized();
    const threeQuat = new THREE.Quaternion(
      resultQuat.GetQ_0,
      resultQuat.GetQ_1,
      resultQuat.GetQ_2,
      resultQuat.GetQ_3
    );
    threeObject.setRotationFromQuaternion(threeQuat);

    if(parentMesh)
    {
      const localPos = parentMesh.worldToLocal(threeObject.position);
      const customLocalPos = new Vector3(localPos.x, localPos.y, localPos.z);
      const transformedCustomLocalPos = this.RotateVectorActive(customLocalPos);
      const resultWorldPos = parentMesh.localToWorld(THREE.Vector3(transformedCustomLocalPos.GetX(), transformedCustomLocalPos.GetY(), transformedCustomLocalPos.GetZ()));
  
      threeObject.position.copy(resultWorldPos);
    }
  }

  ApplyToThreeObjectAsLocal(threeObject, parentGlobalQuaternion, parentMesh) {
    let objQuat = threeObject.quaternion;
    let customObjQuat = RotationQuaternion.ConstructQuaternionFromAxes(objQuat.x, objQuat.y, objQuat.z, objQuat.w).Normalized();

    let resultQuat = customObjQuat.PreMultiply(parentGlobalQuaternion.GetInverse()).PreMultiply(this).PreMultiply(parentGlobalQuaternion).Normalized();
    const threeQuat = new THREE.Quaternion(
      resultQuat.GetQ_0,
      resultQuat.GetQ_1,
      resultQuat.GetQ_2,
      resultQuat.GetQ_3
    );
    threeObject.setRotationFromQuaternion(threeQuat);

    if(parentMesh)
    {
      const localPos = parentMesh.worldToLocal(threeObject.position);
      const customLocalPos = new Vector3(localPos.x, localPos.y, localPos.z);
      const transformedCustomLocalPos = this.RotateVectorActive(customLocalPos);
      const resultWorldPos = parentMesh.localToWorld(THREE.Vector3(transformedCustomLocalPos.GetX(), transformedCustomLocalPos.GetY(), transformedCustomLocalPos.GetZ()));
  
      threeObject.position.copy(resultWorldPos);
    }
  }
}
