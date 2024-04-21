//propagate quaternion to children
//propagate euler to children as matrix
import * as quatlib from "./QuaternionLibrary";
import * as eulerLib from "./EulerAnglesLibrary"

export function RotateChildren(childrenMeshesToRotate, rotationQuaternion, parentMesh, childrenNormalizedPositions=null, eulerRotation=null)
{
    console.log("Importatn stuff!");
    for (let i = 0; i < childrenMeshesToRotate.length; i++)
    {
        let mesh = childrenMeshesToRotate[i];
        let norm = childrenNormalizedPositions[i];

        rotationQuaternion.ApplyToThreeObjectAsGlobal(mesh, parentMesh, norm, eulerRotation);
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