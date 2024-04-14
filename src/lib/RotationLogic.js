//propagate quaternion to children
//propagate euler to children as matrix
import * as quatlib from "./QuaternionLibrary";

function RotateChildren(childrenMeshesToRotate, rotationQuaternion, parentGlobalQuaternion)
{
    for(let mesh of childrenMeshesToRotate)
    {
        rotationQuaternion.ApplyToThreeObjectAsGlobal(mesh, parentGlobalQuaternion);
    }
}