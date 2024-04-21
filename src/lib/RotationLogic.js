//propagate quaternion to children
//propagate euler to children as matrix
import * as quatlib from "./QuaternionLibrary";
import * as eulerLib from "./EulerAnglesLibrary"

export function RotateChildren(childrenMeshesToRotate, rotationQuaternion, parentMesh)
{
    for(let mesh of childrenMeshesToRotate)
    {
        rotationQuaternion.ApplyToThreeObjectAsGlobal(mesh, parentMesh);
    }
}

export function RotateChildrenEuler(childrenMeshesToRotate, childrenNormalizedPositions, eulerRotation, parentMesh)
{
    for (let i = 0; i < childrenMeshesToRotate.length; i++)
    {
        let mesh = childrenMeshesToRotate[i];
        let norm = childrenNormalizedPositions[i];

        eulerRotation.ApplyToThreeObjectAsGlobal(mesh, norm, parentMesh);
    }    
}