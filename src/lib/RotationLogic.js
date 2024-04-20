//propagate quaternion to children
//propagate euler to children as matrix
import * as quatlib from "./QuaternionLibrary";

export function RotateChildren(childrenMeshesToRotate, rotationQuaternion, parentMesh)
{
    for(let mesh of childrenMeshesToRotate)
    {
        rotationQuaternion.ApplyToThreeObjectAsGlobal(mesh, parentMesh);
    }
}