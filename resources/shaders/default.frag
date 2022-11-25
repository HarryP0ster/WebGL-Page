precision mediump float;
varying vec2 frag_uv;
uniform sampler2D img_texture;
void main() 
{
    gl_FragColor = texture2D(img_texture, frag_uv);
}