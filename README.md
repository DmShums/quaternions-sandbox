### Quaternion Sandbox

In this project, our primary focus is to explore and compare
different approaches of how rotations and orientations in 3D
space can be represented mathematically. In particular, we
would like to delve into the concept of quaternions/Euler
angles and how 3D transformations are implemented under
the hood. Also, for convenient visualization we are going
to implement a 3D ”sandbox” environment that would allow
users to rotate objects and switch between different, so to
speak, mathematical back-ends while doing so. The users
should also be able to inspect the orientation of the object.
The significance of the quaternions that this project focuses
on is that they are widely used in mechanics and form the
backbone of many 3D editors.

Concerning the implementation tools, we have made a
decision to implement the quaternion/Euler algebra as a library
in pure JS and bring things to life with three.js, a JavaScript
library known for its capabilities in rendering 3D graphics
within web browsers. The above decisions are motivated by the
fact that other considered tools and frameworks (for example,
implementing the environment with C++ or OpenGL) would
require us to focus more on code rather than logic.
