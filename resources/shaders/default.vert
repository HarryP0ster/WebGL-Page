attribute vec3 vecPos;
attribute vec2 vert_uv;
attribute vec4 vecCol;
varying vec4 fragCol;
varying vec2 frag_uv;
uniform mat4 mWorld;
uniform mat4 mProj;
uniform mat4 mView;

void main() 
{
    frag_uv = vert_uv;
    fragCol = vecCol;
    gl_Position = mProj * mView * mWorld * vec4(vecPos, 1.0);
}
