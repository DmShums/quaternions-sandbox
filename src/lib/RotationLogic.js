//propagate quaternion to children
//propagate euler to children as matrix
import * as quatlib from "./QuaternionLibrary";
import * as eulerLib from "./EulerAnglesLibrary"

export function RotateChildren(childrenMeshesToRotate, rotationQuaternion, parentMesh, childrenNormalizedPositions=null, eulerRotation=null)
{
    if(childrenNormalizedPositions && eulerRotation)
    {
        for (let i = 0; i < childrenMeshesToRotate.length; i++)
        {
            let mesh = childrenMeshesToRotate[i];
            let norm = childrenNormalizedPositions[i];
            rotationQuaternion.ApplyToThreeObjectAsGlobal(mesh, parentMesh, norm, eulerRotation);
        }  
    } else 
    {
        for (let i = 0; i < childrenMeshesToRotate.length; i++)
        {
            let mesh = childrenMeshesToRotate[i];
            rotationQuaternion.ApplyToThreeObjectAsGlobal(mesh, parentMesh);
        } 
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